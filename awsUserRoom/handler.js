const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const uuid = require('uuid/v4');
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

const userTable = process.env.USER_TABLE
const roomTable = process.env.ROOM_TABLE
// Create a response
function response(statusCode, message) {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
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
  const reqBody = JSON.parse(event.body);

  if (
    !reqBody.userId ||
    reqBody.userId.trim() === ''

  ) {
    return callback(
      null,
      response(400, {
        error: 'Sala deve ter id de usuário'
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
        error: 'Sala deve ter id '
      })
    );
  }

  if (
    !reqBody.title ||
    reqBody.title.trim() === ''

  ) {
    return callback(
      null,
      response(400, {
        error: 'Sala deve ter título'
      })
    );
  }

  if (
    !reqBody.descripton ||
    reqBody.descripton.trim() === ''
  ) {
    return callback(
      null,
      response(400, {
        error: 'Sala deve ter descrição'
      })
    );
  }

  if (reqBody.roomPicture) {
    let decodedImage = Buffer.from(reqBody.roomPicture.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    let s3bucket = new AWS.S3({
      Bucket: 'rooms-pics',
    });

    var params = {
      Bucket: 'rooms-pics',
      Key: `${roomId}.${type}`,
      Body: decodedImage,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`
    }
    const s3Response = await s3.putObject(params).promise()

    if (s3Response) {
      let roomPicture = 'https://pca-knowns-users.s3.amazonaws.com/' + roomId + '.jpeg'

      const room = {
        roomId: reqBody.roomId,
        roomPicture: roomPicture,
        createdAt: new Date().toISOString(),
        userId: reqBody.userId,
        title: reqBody.title,
        descripton: reqBody.descripton,

      }

      return db
        .put({
          TableName: roomTable,
          Item: room
        })
        .promise()
        .then(() => {
          callback(null, response(201, room));
        })
        .catch((err) => response(null, response(err.statusCode, err)))

    }

  } else {

    let roomPicture = 'https://pca-knowns-users.s3.amazonaws.com/' + roomId + '.jpeg'

    const room = {
      roomId: reqBody.roomId,
      roomPicture: '',
      createdAt: new Date().toISOString(),
      userId: reqBody.userId,
      title: reqBody.title,
      descripton: reqBody.descripton,

    }

    return db
      .put({
        TableName: roomTable,
        Item: room
      })
      .promise()
      .then(() => {
        callback(null, response(201, room));
      })
      .catch((err) => response(null, response(err.statusCode, err)))


  }


  ;
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
  const userId = event.pathParameters.roomId;

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
  const id = event.pathParameters.id;
  const params = {
    Key: {
      id: id
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
      callback(null, response(201, 'Usuário criado'));
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






