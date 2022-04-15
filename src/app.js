const express = require("express");
const cors = require('cors'); 
const fs = require('fs');
const removeOne = require('remove-one')
const AppError = require('./error/AppError')
const errors=require('./middleware/errors')
const Respuesta=require('./model/Respuesta')
const Productos=require('./model/Productos')
var path = require('path');
const PORT =  3000;
const pathFile=__dirname+'/data/data.json'
const encoding ="utf8"
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin:'*',
  }));
  
app.use('/img', express.static(path.join(__dirname, '..', 'public','/img')))
function helperCatch(callback){
    return async (req,res,next)=>{
      try{
        await callback(req,res,next)
      }
      catch(e){
        console.log("Aqui error->>",e)
        const newError=new AppError(e)
        if(e.name===newError.name)
          next(newError)
        next(e)
      } 
    }
}
const getJsonData=async ()=>(
    JSON.parse(await fs.readFileSync(pathFile,encoding))
)
const setJsonData=async (data)=>(
  await fs.writeFileSync(pathFile,JSON.stringify( data),encoding)
)

app.get("/", helperCatch(async(req,res)=>{
    const data = await getJsonData()
    return res.status(200).json(data)
}));
app.post("/", helperCatch(async(req,res)=>{
    let data = await getJsonData()
    const Producto = new Productos(req.body);
    let productos =[...data.Productos];
    if(productos.filter(e=> e.text === Producto.text).length){
        return res.status(200).json(new Respuesta("Ya existe esta descripción",false))    
    }
    if(productos.filter(e=> e.url === Producto.url).length){
        return res.status(200).json(new Respuesta("Ya existe esta url",false))    
    }
    Producto.getCreateProducto();
    data.Productos.push({...Producto});
    await setJsonData( data)
    return res.status(200).json(new Respuesta("Agregado correctamente",true))
}));

app.delete("/", helperCatch(async(req,res)=>{
    let data = await getJsonData()
    // const Producto = new Productos(req.body);
    let productos =[...data.Productos];
    const newProductos=removeOne(productos,e=>e.id===req.body.id)
    if(newProductos.length===productos.length){
        return res.status(400).json(new Respuesta("No se encontro elemento",false))
    }
    data.Productos = newProductos
    await setJsonData(data)
    return res.status(200).json(new Respuesta("Eliminado correctamente",true))
}));

app.put("/", helperCatch(async(req,res)=>{
    let data = await getJsonData()
    const Producto = new Productos(req.body);
    let isFound=false;
    let productos =[...data.Productos];
    productos.forEach(e=>{
      if(e.id===Producto.id){
        e.url=Producto.url;
        e.text=Producto.text;
        e.img=Producto.img;
        e.costo=Producto.costo;
        e.cantidad=Producto.cantidad;
        data.Productos = productos
        isFound=true;
      }
    })
    if(isFound){
      await setJsonData(data)
      return res.status(200).json(new Respuesta("Actualizado correctamente",true))
    }
    return res.status(200).json(new Respuesta("No se actualizo correctamente",false))
}));

app.use(errors)

app.listen(PORT, () => {
  console.log(`API is listening in port ${PORT}`);
});
