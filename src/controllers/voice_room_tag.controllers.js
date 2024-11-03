import { Tag } from "../models/tag.models.js";
import { VoiceRoomTag } from "../models/voice_room_tag.model.js";
import { VoiceRoom } from "../models/voice_rooms.models.js";

export const createVoiceRoomTag = async (req, res) => {
  const { room_id, tag_id } = req.body;
    try {
        const room = VoiceRoom.findByPk(room_id);
        const tag = Tag.findByPk(tag_id);
        if(!room){
            throw Error("No se encontro la sala");
        }
        if(!tag){
            throw Error("No se encontro el tag");
        }

        let result = await VoiceRoomTag.create({
            room_id,
            tag_id
        })
        
        
    } catch (error) {
        
    }
};