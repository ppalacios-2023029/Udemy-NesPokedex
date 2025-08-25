export interface HttpAdapter { //Adaptador por si se quiere cambiar Axios s
    get<T>(url:string) : Promise<T>
}