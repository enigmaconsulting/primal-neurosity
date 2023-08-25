
const { Client } = require("pg")
const { Neurosity } = require("@neurosity/sdk");
var connectionString = "postgres://primal:primal@localhost:5432/primal"; 

require("dotenv").config();

email = process.env.EMAIL;
password = process.env.PASSWORD;
deviceId = process.env.DEVICE_ID;

console.log(process.env) // remove this after you'


const client = new Client(connectionString)
client.connect()


const verifyEnvs = (email, password, deviceId) => {
    const invalidEnv = (env) => {
      return env === "" || env === 0;
    };
    if (invalidEnv(email) || invalidEnv(password) || invalidEnv(deviceId)) {
      console.error(
        "Please verify deviceId, email and password are in .env file, quitting..."
      );
      process.exit(0);
    }
  };
  console.log(process.env.EMAIL);
  
  verifyEnvs(email, password, deviceId);
  
  console.log(`${email} attempting to authenticate to ${deviceId}`);

  const neurosity = new Neurosity({
    deviceId
  });

  const main = async () => {
    await neurosity
      .login({
        email,
        password
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
        console.log("Logged in");
      })
  };

  neurosity.calm().subscribe((calm) => {
    if (calm.probability > 0.4) {
      console.log("Calm");
    }
  });

  neurosity.kinesis("disappear").subscribe((intent) => {
    console.log("Eyes Closed");
  });

  neurosity.focus().subscribe((focus) => {
    if (focus.probability > 0.35) {
      console.log("Focus");
    }
  });

  async neurosity.brainwaves("raw").subscribe((brainwaves) => {
   // console.log(brainwaves);
   try {
    // const text = 'INSERT INTO primal(data, info, notchfreq, sampling startime, label) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'
    // const values = (brainwaves.data, brainwaves.info, "freq", "sampling", "startime", "devicid")

    const text = 'INSERT INTO primal(data, info, notchfreq, sampling startime, label) VALUES(["data","moredata"], "info", "freq", "sampling", "startime", "deviceid")'
    // console.log(values)
    console.log(text)

    /* brainwaves.alpha
    brainwaves.beta
    brainwaves.delta
    brainwaves.gamma
    brainwaves.theta
    brainwaves.psd
    */


    var res = await client.query(text)
    console.log(res)

    } catch (err) {
      console.error(err);
    } finally {
      client.end()
    }
      });
  
  main();

