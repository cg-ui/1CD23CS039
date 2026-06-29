=>Stage 1


Base url : /notification

Headers :
Authorization: Bearer token

1 Get All Notifications

endpoint :
GET /notification

2 Get Notification by ID

Endpoint
GET /notification/:id


3 Create Notification

Endpoint
POST /notification

4 Mark Notification as Read

Endpoint
PATCH /notification/:id/read

5 Delete Notification

endpoint
DELETE /notification/:id



=>Stage 2

Database

I will use mongoDB because the notifications are simple JSON documents and MongoDB can store data in proper document format, it is easy for operations like reafd, write etc.



Collections

students with id,name,email

json
{
  "_id": "001",
  "name": "raju",
  "email": "raju@gmail.com"
}


notifications with type,message ,time

json
{
  "_id": "notificationId",
  "type": "feedback"
  "message": "welcome to college",
  "time": "15:03 25/06/2026"
}



Problems if data increases :

Searching the notifications becomes slower.
Database size keeps increasing largely.
More users getting notifications can be difficult.


Solutions

Use indexes for attributes.
Archive old notifications.


MongoDB queries

Get all notifications
db.notifications.find()


Get Notification by ID
db.notifications.findOne({ _id: "001" });


Create Notification
db.notifications.insertOne({
    message: "Microsoft Hiring Drive",
    time: time
});


Delete Notification
db.notifications.deleteOne({
    _id: "001"
});


=>Stage 3

the database has grown from 50k to 50 lakh students making a huge increase in the capacity. 
Also retrieving among such large database and ordering or arranging according to created time increases the computation time.

To overcome this we can create indexes accordingly

Should indexes be added on every column
No

Adding indexes on every column is not good.

Indexes consume extra storage.
CRUD operations become costly because the indexes should be updated accordingly.
Many indexes may not be used by queries.

query to get student who got placement notification in last 7 days
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';

=>Stage 4
Fetching notifications for each page request puts load on the database. 

methods to increase the efficiency of this process:
Notifications cache – to avoid database calls for each similar request.
Load notifications when required, not for each page request ex. loading them only after the user opened the notification page).
Advantages: Eases database load and speeds up the process.
Disadvantages: Notifications from cache may be somewhat outdated.

Load only when required
Advantages: No unnecessary requests to the database
Disadvantages: Loading happens only after the user accesses the notification area.



=>Stage 5
the given function is complex because:

Notifications are sent to one student at a time making it very slow
If sending email fails for a student remaining students have to wait
If application crashes in middle some students get notifications while others may not

Saving the process to db as well as sending the email should not take place together it becomes heavy task.


=>Stage 6

JS code using axios,async function to get top 10 notifications

const axios = require("axios");

const weights = {
    Placement: 3,
    Result: 2,
    General: 1
};

async function Notify() {
    const response = await axios.get(
        "http://4.224.186.213/evaluation-service/notifications",
        {
            headers: {
                Authorization: "Bearer token"
            }
        }
    );

    const notifications = response.data.notifications;

    notifications.sort((a, b) => {
        if (weights[b.Type] !== weights[a.Type]) {
            return weights[b.Type] - weights[a.Type];
        }

        return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    const top10 = notifications.slice(0, 10);

    console.table(top10);
}

Notify();