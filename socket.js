export default function registerSocketHandlers(io){
    console.log("socket handlers called")
    io.on("connection",(socket)=>{
       const userId =  socket.handshake.auth.userId || socket.handshake.query.userId;
    
       console.log("Socket connected",socket.id)

       if(userId){
        socket.join(userId);//Personal room join
        console.log(`user ${userId} join a personal room`)
        
       }

       socket.on("join",(otherUserId)=>{
        socket.join(otherUserId);
        console.log(`user ${userId} with ${otherUserId} join a chat`)
       })
       socket.on("send-message",(data)=>{
        const {otherUserId,message}= data;

        socket.to(otherUserId).emit("receive-message",message)
       })
    })
}