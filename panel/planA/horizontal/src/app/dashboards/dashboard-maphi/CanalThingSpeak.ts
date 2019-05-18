class CanalThingSpeak

    {
    public constructor(
        public channel:Channel,
        public feeds: Feed[]
    ){
        
    }

    getChannel():Channel{
        return this.channel;
    }

    getField1():string{
        return this.channel.field1;
    }

    getField2():string{
        return this.channel.field2;
    }
}