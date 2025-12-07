import Conversation from "./models/Conversation.js";

export default function registerSocketHandlers(io) {
    console.log("socket handlers called")
    io.on("connection", (socket) => {
        const userId = socket.handshake.auth.userId || socket.handshake.query.userId;

        console.log("Socket connected", socket.id)

        if (userId) {
            socket.join(userId);//Personal room join
            console.log(`user ${userId} join a personal room`)

        }

        socket.on("join", (otherUserId) => {
            socket.join(otherUserId);
            console.log(`user ${userId} with ${otherUserId} join a chat`)
        })
        socket.on("send-message", async (data) => {
            const { otherUserId, text } = data;

            try {
                //find or create conversation
                let conversation = await Conversation.findOne({
                    participants: { $all: [userId, otherUserId] }
                }).populate("participants")

                let isNew = false
                if (!conversation) {
                    isNew=true
                    conversation = new Conversation({
                        participants: [userId, otherUserId]
                    })
                }

                await conversation.save()
                socket.to(otherUserId).emit("receive-message", {
                    text,
                    conversation,
                    isNew
                })

            } catch (error) {

            }


        })
    })
}