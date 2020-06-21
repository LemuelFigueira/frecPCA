const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const { "v4": uuidv4 } = require('uuid')
const multipart = require('aws-multipart-parser');
const shortid = require('shortid');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

// AWS.config.update({
//   accessKeyId: process.env.accessKeyId,
//   secretAccessKey: process.env.secretAccessKey,
//   region:  process.env.region
// });

const participantTable = process.env.PARTICIPANT_TABLE

// Create a response
function response(statusCode, message) {
  return {
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    },
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}
function sortByDate(a, b) {
  if (a.createdAt > b.createdAt) {
    return -1;
  } else return 1;
}

module.exports.createParticipant = (event, context, callback) => {
  const reqBody = multipart.parse(event, true)

  let userPictureKey = uuidv4()

  if (
    !reqBody.roomId ||
    reqBody.roomId.trim() === ''

  ) {
    return callback(
      null,
      response(400, {
        error: 'Participante deve ter id da Sala '
      })
    );
  }

  if (
    !reqBody.userPicture

  ) {
    return callback(
      null,
      response(400, {
        error: 'Participante deve ter foto'
      })
    );
  }

  if (
    !reqBody.name ||
    reqBody.name.trim() === ''
  ) {
    return callback(
      null,
      response(400, {
        error: 'Participante deve ter nome'
      })
    );
  }

  let ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let ID_LENGTH = 4;

  let participantId = '';
  for (let i = 0; i < ID_LENGTH; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }



  const type = reqBody.userPicture.contentType.split('/')[1]



  let s3bucket = new AWS.S3({
    Bucket: 'pca-knowns-users',
  });

  var params = {
    Bucket: 'pca-knowns-users',
    Key: `${userPictureKey}.${type}`,
    Body: reqBody.userPicture.content,
    ContentType: reqBody.userPicture.contentType
  };
  s3bucket.putObject(params, function (err, data) {
    if (err) {
      console.log('error in callback');
      console.log(err);
    } else if (data) {

      let userPicture = 'https://pca-knowns-users.s3.amazonaws.com/' + userPictureKey + `.${type}`

      const participant = {
        id: participantId,
        createdAt: new Date().toISOString(),
        roomId: reqBody.roomId,
        name: reqBody.name,
        userPicture: `${userPictureKey}.${type}`,
        validity: false

      };

      return db
        .put({
          TableName: participantTable,
          Item: participant,
          ConditionExpression: 'attribute_not_exists(id)',
        })
        .promise()
        .then(() => {
          callback(null, response(201, participant));
        })
        .catch((err) => {
          if (err.statusCode === 400) {
            callback(null, response(400, 'Usuário ja cadastrado na sala'))
          } else {
            response(null, response(err.statusCode, err))
          }
        })
    }
  })

};

// Get all rooms
module.exports.getAllparticipant = (event, context, callback) => {
  return db
    .scan({
      TableName: participantTable
    })
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items.sort(sortByDate)));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// Update a Participant
module.exports.updateParticipant = (event, context, callback) => {
  const reqBody = JSON.parse(event.body)

  const id = reqBody.id;
  const roomId = reqBody.roomId;

  const params = {
    TableName:participantTable,
    Key:{
        "id": id,
        "roomId": roomId
    },
    UpdateExpression: "set validity = :v",
    ExpressionAttributeValues:{
        ":v":true,
    },
    ReturnValues:"UPDATED_NEW"
  };

  console.log("Updating the item...");
  return db
  .update(params)
  .promise()
  .then(() => {
    callback(null, response(201, "UpdateItem succeeded"));
  })
  .catch((err) => callback(null, response(err.statusCode, err)));
}

// Get a Participant By Room
module.exports.getParticipantByRoom = (event, context, callback) => {
  const reqBody = JSON.parse(event.body)
  const id = reqBody.id;
  const roomId = reqBody.roomId;

  if (
    !reqBody.id ||
    reqBody.id.trim() === ''

  ) {
    return callback(
      null,
      response(400, {
        error: 'Participante deve ter id '
      })
    );
  }

  if (
    !reqBody.roomId ||
    reqBody.roomId.trim() === ''

  ) {
    return callback(
      null,
      response(400, {
        error: 'Participante deve ter id da sala '
      })
    );
  }

  const params = {

    KeyConditionExpression: 'id = :id and roomId =:roomId',
    ExpressionAttributeValues: {
      ':id': id,
      ':roomId': roomId
    },
    TableName: participantTable
  };

  return db
    .query(params)
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items.sort(sortByDate)));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};