class Productos{
    constructor({id,url,text,img,costo,cantidad}) {
        this.id=id;
        this.url=url;
        this.text=text;
        this.img=img;
        this.costo=costo;
        this.cantidad=cantidad;
    }
    getCreateProducto(){
        this.id = Math.random();
    }
}
module.exports=Productos;