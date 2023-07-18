import dotenv from "dotenv";
import express from "express";
import {SignJWT, jwtVerify} from "jose";

dotenv.config();
const appExpress = express();



appExpress.get("/:id/:nombre", async(req,res)=>{
    let json = {
        id: req.params.id,
        nombre: req.params.nombre
    }

    const encoder = new TextEncoder();
    const jwtConstructor = new SignJWT({json});
    const jwt = await jwtConstructor
    .setProtectedHeader({alg:"HS256", typ:"JWT"})
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(encoder.encode(process.env.JWT_KEY))
    res.send({jwt})
})

appExpress.post("/", async(req,res)=>{
    const {authorization} = req.headers;
    if(!authorization) return res.status(401).send({token: ":(Pailas"});
    try {
        const encoder = new TextEncoder();
        const jwtData = await jwtVerify(
            authorization,
            encoder.encode(process.env.JWT_KEY)
        )
        res.send(jwtData)
    } catch (error) {
        res.status(401).send("algo salio mal")
    }
})


let config = JSON.parse(process.env.MY_CONFIG)
appExpress.listen(config, ()=>console.log(`http://${config.hostname}:${config.port}`))