const cron=require('cron').CronJob;

module.exports.schedule=(cb)=>{
    //'0 2 * * *'=>means 2AM every day [ min hr day_mnth mnth day_week]
    const job=new cron('* * * * *',cb,null,false);  
    job.start();
}