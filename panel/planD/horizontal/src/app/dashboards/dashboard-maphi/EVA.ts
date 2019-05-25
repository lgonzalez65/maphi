export class EVA{
    public canal: CanalThingSpeak;

    public constructor(
        public nombre: string,
        public descripcion: string,
        public canalID: string,
        public api_key: string
    ){
        this.canal=null;
    }

    public getCampo1(){
        let valores = [];
        let etiqueta = this.canal.channel.field1;
        for (let f of this.canal.feeds) {
            valores.push(Number(f.field1));
          }
        return valores;
    }
    public getField1() {
        let valores = [];
        let etiqueta = this.canal.channel.field1;
        for (let f of this.canal.feeds) {
            valores.push(Number(f.field1));
          }
        return { data:  valores, label: etiqueta };
    }

    public getField2() {
        let valores = [];
        let etiqueta = this.canal.channel.field2;
        for (let f of this.canal.feeds) {
            valores.push(Number(f.field2));
          }
        return { data:  valores, label: etiqueta };
    }


    public getCreatedAt() {
        let valores = [];
        for (let f of this.canal.feeds) {
            valores.push(f.created_at);
          }
        return valores;
    }

}