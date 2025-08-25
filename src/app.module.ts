import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import { SeedModule } from './seed/seed.module';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        load: [EnvConfiguration],
        validationSchema: JoiValidationSchema
      }
    ),

    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'public')
      }
    ),

    MongooseModule.forRoot(process.env.MONGODB!, {dbName: 'pokemonsDb'}),
    

    PokemonModule,

    CommonModule,

    SeedModule
  ]
})

export class AppModule {
  
}
