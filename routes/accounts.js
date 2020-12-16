import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    let account = req.body;

    
    const data = JSON.parse(await readFile(global.fileName));

    account = { 
      id: data.nextId++,
      name: account.name,
      balance: account.balance
    };

    data.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(account);

    logger.info(`Post /account - ${JSON.stringify(account)}`)
  } catch (err) {
    next(err)
  }
});

router.get("/", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextId;
    res.send(data);

    logger.info(`Post /account`)
  } catch (err) {
    next(err)
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    let account = data.accounts.find(
      (account) => account.id == parseInt(req.params.id)
    );
    res.send(account);

    logger.info(`Get /account/id`)
  } catch (err) {
    next(err)
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    data.accounts = data.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.end();

    logger.info(`Delete /account/id - ${req.params.id}`)
  } catch (err) {
    next(err)
  }
});

router.put("/", async (req, res, next) => {
  try {
    let account = req.body;

    if(!account.name || !account.balance){
      throw new Error("Name e Balance são obrigatorios.")
    }

    const data = JSON.parse(await readFile(global.fileName));
    const searchindex = data.accounts.findIndex(
      (search) => search.id === account.id
    );

    if (index === -1) {
      throw new Error("Registro não encontrado.")
    }


    data.accounts[searchindex].name = account.name;
    data.accounts[searchindex].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(account);

    logger.info(`Put /account - ${JSON.stringify(account)}`)
  } catch (err) {
    next(err)  
  }
});

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`)
  res.status(400).send({ error: err.message });
})
export default router;
