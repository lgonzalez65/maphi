class Channel {
    public constructor(

        public id: string,
        public name: string,
        public description: string,
        public latitude: string,
        public longitude: string,
        public field1: string,
        public field2: string,
        public field3: string,
        public field4: string,
        public field5: string,
        public field6: string,
        public field7: string,
        public field8: string,
        created_at: string,
        updated_at: string,
        last_entry_id: string
    ) {

    }

    public getFields1():string{
        return this.field1;
    }

    public getField2():string{
        return this.field2;
    }

    public getField3():string{
        return this.field3;
    }
    public getField4():string{
        return this.field4;
    }
    public getField5():string{
        return this.field5;
    }
    public getField6():string{
        return this.field6;
    }
    public getField7():string{
        return this.field7;
    }
    public getField8():string{
        return this.field8;
    }
}