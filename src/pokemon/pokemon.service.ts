import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import {isValidObjectId, Model} from 'mongoose'
import { Pokemon } from './entities/pokemon.entity';
import {InjectModel} from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ){
    this.defaultLimit = configService.get<number>('defaultLimit',7)
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()

    try{
       const pokemon = await this.pokemonModel.create(createPokemonDto)
       return pokemon
    }catch(error){
      this.handleExceptions(error)
    }
  }

  findAll(paginationDto: PaginationDto) {
    const {limit = this.defaultLimit, offset = 0} = paginationDto
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort(
        {
          no:1
        }
      )
      .select('-__v')
    
  }

async findOne(term: string): Promise<Pokemon> { //Term = Término de búsqueda

  let pokemon: Pokemon | null = null

  if (!isNaN(+term)) {
    pokemon = await this.pokemonModel.findOne({ no: term })
  }

  //MongoId
  if(!pokemon && isValidObjectId(term)){
    pokemon = await this.pokemonModel.findById(term)
  }

  //Name
  if(!pokemon) {
    pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()})
  }

  if (!pokemon) {
    throw new NotFoundException(`Pokemon with term "${term}" not found`)
  }

  return pokemon
}


async update(term: string, updatePokemonDto: UpdatePokemonDto) {
  const pokemon = await this.findOne(term) //Esto sirve para las dos formas porque el findOne lo creamos nosotros

  try{
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()

    await pokemon.updateOne(updatePokemonDto)

    return {...pokemon.toJSON(), ...updatePokemonDto}
  }catch(error){
    this.handleExceptions(error)
  }

  //FORMA MODERNA DE REALIZAR EL UPDATE
  /*try { 
    // Usamos Object.assign para copiar solo los campos presentes
    // Y solo actualiza los campos que esten en la solicitud
    Object.assign(pokemon, updatePokemonDto);

    await pokemon.save();
    return pokemon;
  } catch (error) {
    throw new InternalServerErrorException(
      `Error al actualizar el Pokémon: ${error}`)
  }*/

}


  async remove(id: string) {
    /*const pokemon = await this.findOne(id)
    await pokemon.deleteOne()*/
    //return {id}
    //const res = await this.pokemonModel.findByIdAndDelete(id) 
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id})
    if( deletedCount === 0)
      throw new BadRequestException(`Pokemon with id :${id} not found`)
    return 
  }


  private handleExceptions( error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error)
    throw new InternalServerErrorException('Cant create Pokemon - Check server logs')
  }

}
