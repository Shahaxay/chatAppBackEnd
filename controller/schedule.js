const ScheduleTask=require('../service/scheduleTask');
const Message=require('../model/message');
const ArchieveMessage=require('../model/archieveMessage');

async function copyLastDayMessage(){
  //logic for copy chat
  try{
      let lastDaysMessages=await Message.findAll({
        attributes:['message','multimedia','name','userId','groupId']
      });
      lastDaysMessages=lastDaysMessages.map(msg=>msg.dataValues);
      await ArchieveMessage.bulkCreate(lastDaysMessages);
      //delete all the records of Message
      await Message.destroy({
        where:{}
      })
      console.log("copying done");
      
  }catch(err){
    console.log(err);
  }

}

module.exports.copyLastDayChatToArchieveChatTable=()=>{
    ScheduleTask.schedule(copyLastDayMessage);
}

