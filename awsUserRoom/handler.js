const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const { "v4": uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const multipart = require('aws-multipart-parser');
const salt = bcrypt.genSaltSync(10)
const utf8 = require('utf8');
const s3bucket = new AWS.S3({
  Bucket: 'event-pics-pca',
});

const userTable = process.env.USER_TABLE
const roomTable = process.env.ROOM_TABLE
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

module.exports.createRoom = (event, context, callback) => {
  const reqBody = JSON.parse(event.body)


  let eventId = uuidv4()

  if (
    !reqBody.userId ||
    reqBody.userId.trim() === ''

  ) {
    return callback(
      null,
      response(400, {
        error: 'Evento deve ter id de usuário'
      })
    );
  }

  if (
    !reqBody.eventBeginTime ||
    reqBody.eventBeginTime.trim() === ''

  ) {
    return callback(
      null,
      response(400, {
        error: 'Evento deve horário de inicio '
      })
    );
  }

  if (
    !reqBody.eventEndTime ||
    reqBody.eventEndTime.trim() === ''

  ) {
    return callback(
      null,
      response(400, {
        error: 'Evento deve horário de encerramento '
      })
    );
  }

  if (
    !reqBody.eventName ||
    reqBody.eventName.trim() === ''

  ) {
    return callback(
      null,
      response(400, {
        error: 'Evento deve ter nome'
      })
    );
  }

  if (
    !reqBody.eventDescription ||
    reqBody.eventDescription.trim() === ''
  ) {
    return callback(
      null,
      response(400, {
        error: 'Evento deve ter descrição'
      })
    );
  }

  if (
    !reqBody.eventCity ||
    reqBody.eventCity.trim() === ''
  ) {
    return callback(
      null,
      response(400, {
        error: 'Defina a cidade do evento'
      })
    );
  }

  if (
    !reqBody.eventDistrict ||
    reqBody.eventDistrict.trim() === ''
  ) {
    return callback(
      null,
      response(400, {
        error: 'Defina o bairro do evento'
      })
    );
  }

  if (
    !reqBody.eventAdress ||
    reqBody.eventAdress.trim() === ''
  ) {
    return callback(
      null,
      response(400, {
        error: 'Defina o endereço do evento'
      })
    );
  }

  if (
    !reqBody.eventParticipants
  ) {
    return callback(
      null,
      response(400, {
        error: 'Defina o número de participantes do evento'
      })
    );
  }

  callback(null, response(201, reqBody))

  const room = {
    roomId: eventId,
    eventBeginTime: reqBody.eventBeginTime,
    eventEndTime: reqBody.eventEndTime,
    eventDistrict: reqBody.eventDistrict,
    eventCity: reqBody.eventCity,
    eventAdress: reqBody.eventAdress,
    roomPicture: "",
    createdAt: new Date().toISOString(),
    userId: reqBody.userId,
    eventName: reqBody.eventName,
    participants: reqBody.eventParticipants,
    eventDescription: reqBody.eventDescription,
  }

  if (reqBody.roomPicture === 'no picture') {

    return db
      .put({
        TableName: roomTable,
        Item: room,
        ConditionExpression: 'attribute_not_exists(id)',
      })
      .promise()
      .then(() => {
        callback(null, response(201, room));
      })
      .catch((err) => callback(null, response(err.statusCode, err)))

  } else {

    let decodedImage = Buffer.from(reqBody.roomPicture.replace(/^data:image\/\w+;base64,/, ""), 'base64')

    const type = reqBody.roomPicture.split(';')[0].split('/')[1]


    let s3bucket = new AWS.S3({
      Bucket: 'event-pics-pca',
    });

    var params = {
      Bucket: 'event-pics-pca',
      Key: `${eventId}.${type}`,
      Body: decodedImage,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`,
    };

    s3bucket.putObject(params, function (err, data) {
      if (err) {
        console.log('error in callback');
        console.log(err);
      } else if (data) {

        let eventPicture = 'https://event-pics-pca.s3.amazonaws.com/' + eventId + `.${type}`
        room.roomPicture = eventPicture

        return db
          .put({
            TableName: roomTable,
            Item: room,
            ConditionExpression: 'attribute_not_exists(id)',
          })
          .promise()
          .then(() => {
            callback(null, response(201, room));
          })
          .catch((err) => callback(null, response(err.statusCode, err)))

      }
    })
  }
};
// Get all rooms
module.exports.getAllRooms = (event, context, callback) => {
  return db
    .scan({
      TableName: roomTable
    })
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items.sort(sortByDate)));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// Get a single room
module.exports.getRoom = (event, context, callback) => {
  const id = event.pathParameters.roomId;



  var params = {

    KeyConditionExpression: 'roomId = :id',
    ExpressionAttributeValues: {
      ':id': id
    },
    TableName: roomTable,

  }

  return db
    .query(params)
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items));

    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};
// Update a room
module.exports.updateRoom = (event, context, callback) => {
  const id = event.pathParameters.id;
  const reqBody = JSON.parse(event.body);
  const { title, description } = reqBody;

  if (
    !reqBody
  ) {
    return callback(
      null,
      response(400, {
        error: 'Corpo da requisição vazio'
      })
    );
  }

  if (
    !id ||
    id.trim() === ''

  ) {
    return callback(
      null,
      response(400, {
        error: 'id não identificado'
      })
    );
  }

  const params = {
    Key: {
      id: id
    },
    TableName: postsTable,
    ConditionExpression: 'attribute_exists(id)',
    UpdateExpression: 'SET title = :title, description = :description',
    ExpressionAttributeValues: {
      ':title': title,
      ':description': description
    },
    ReturnValues: 'ALL_NEW'
  };

  return db
    .update(params)
    .promise()
    .then((res) => {
      console.log(res);
      callback(null, response(200, res.Attributes));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// Get users room
module.exports.userRooms = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);
  const userId = reqBody.userId

  if (
    !reqBody.userId ||
    reqBody.userId.trim() === ''

  ) {
    return callback(
      null,
      response(400, {
        error: 'userId é obrigatório.'
      })
    );
  }



  const params = {
    FilterExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    TableName: roomTable
  };

  console.log(params)

  return db
    .scan(params)
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items.sort(sortByDate)));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};
// Delete a post
module.exports.deleteRoom = (event, context, callback) => {
  const reqBody = JSON.parse(event.body)
  const roomId = reqBody.roomId;
  const userId = reqBody.userId;

  const params = {
    Key: {
      roomId: roomId,
      userId : userId
    },
    TableName: roomTable
  };
  return db
    .delete(params)
    .promise()
    .then(() =>
      callback(null, response(200, { message: 'Sala excluída' }))
    )
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// Create User
module.exports.createUser = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);


  if (
    !reqBody.username ||
    reqBody.username.trim() === ''

  ) {
    return callback(
      null,
      response(400, {
        error: 'Usuário não pode estar vazio.'
      })
    );
  }

  if (
    !reqBody.password ||
    reqBody.password.trim() === ''
  ) {
    return callback(
      null,
      response(400, {
        error: 'Usuário deve ter senha'
      })
    );
  }

  let hash = bcrypt.hashSync(reqBody.password, salt)
  const user = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    username: reqBody.username,
    password: hash,

  };

  return db
    .put({
      TableName: userTable,
      Item: user,
      ConditionExpression: "attribute_not_exists(username)"
    })
    .promise()
    .then(() => {
      callback(null, response(201, user));
    })
    .catch((err) => {

      callback(null, response(400, 'Usuário já cadastrado'));
    });
};

module.exports.logIn = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);


  if (
    !reqBody.username ||
    reqBody.username.trim() === ''

  ) {
    return callback(
      null,
      response(400, {
        error: 'Usuário não informado'
      })
    );
  }

  if (
    !reqBody.password ||
    reqBody.password.trim() === ''
  ) {
    return callback(
      null,
      response(400, {
        error: 'Senha não informada'
      })
    );
  }

  const params = {
    Key: {
      username: reqBody.username
    },
    TableName: userTable
  }

  return db
    .get(params)
    .promise()
    .then((data) => {
      if (data) {
        let result = bcrypt.compareSync(reqBody.password, data.Item.password)
        if (result) {
          callback(null, response(200, data));
        } else {
          callback(null, response(401, 'Senha ou usuário incorretos'));
        }
      } else {
        callback(null, response(401, 'Senha ou usuário incorretos'));
      }
    })
    .catch((err) => callback(null, response(401, 'Senha ou usuário incorretos')));
};






