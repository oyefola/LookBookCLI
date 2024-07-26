import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { MakeupItem, MakeupLook } from "./DataTypes";

const program = new Command();

program.version("1").description("LOOKBOOK CLI");

const makeupBagPath = path.resolve(__dirname, "data/makeupItems.json");
const makeupBag: MakeupItem[] = JSON.parse(
  fs.readFileSync(makeupBagPath, "utf-8")
);
const looks: MakeupLook[] = [];

function displayHeader() {
    console.log(chalk.yellowBright.bgBlack.bold("Welcome to the LookBook, Diva ✨"));
}

async function mainMenu() {
  displayHeader();
  const choices = [
    "Create a Look",
    "View all looks",
    "Select a Look",
    "Add item to Makeup Bag",
    "View Makeup Bag",
    "Combine two looks",
    "Exit",
  ];
  const answer = await inquirer.prompt({
    name: "choice",
    type: "list",
    message: chalk.blue("What do you want to do, darling?✨"),
    choices,
  });
  switch (answer.choice) {
    case "Create a Look":
      await createLook();
      break;
    case "View all looks":
      await viewAllLooks();
      break;
    case "Select a Look":
      await selectALook();
      break;
    case "Add item to Makeup Bag":
      await addItemToMakeupBag();
      break;
    case "View Makeup Bag":
      await viewMakeupBag();
      break;
    case "Combine two looks":
      await combineTwoLooks();
      break;
    case "Exit":
      console.log(chalk.green("See you later darling!"));
      process.exit(0);
      break;
    default:
      console.log(chalk.red("I think we may have gotten lost darling"));
      mainMenu();
  }
}
mainMenu();
program.parse(process.argv);

async function createLook() {
  const { name } = await inquirer.prompt({
    name: "name",
    type: "input",
    message: chalk.yellow("What's the new look, diva?"),
  });
  const lookItems: MakeupItem[] = [];
  let addItem = false;
  while (!addItem) {
    const { itemIndex } = await inquirer.prompt({
      name: "itemIndex",
      type: "list",
      message: chalk.yellow("What do you want to make your look with?"),
      choices: makeupBag.map((item, index) => ({
        name: `${item.type} - ${item.brand} - ${item.name} - ${item.shade}`,
        value: index,
      })),
    });

    lookItems.push(makeupBag[itemIndex]);
    const { continueAdding } = await inquirer.prompt({
      name: "continueAdding",
      type: "confirm",
      message: chalk.yellow("Is that all your look is made of, darling?"),
      default: true,
    });
    addItem = continueAdding;
  }
  const newLook: MakeupLook = { name, components: lookItems };
  looks.push(newLook);
  console.log(
    chalk.green(`Darling, your ${name} look was successfully created!`)
  );
  mainMenu();
}

function viewAllLooks() {
  console.log(chalk.magentaBright("Here are all your looks, Fashionista!"));
  const choices = looks.map((look, index) => ({
    name: `${index + 1}. ${look.name}`,
    value: look,
  }));

  inquirer
    .prompt([
      {
        type: "list",
        name: "selectedLook",
        message: chalk.blue("Select a look to view more details:"),
        choices,
      },
    ])
    .then((answers) => {
      const selectedLook = answers.selectedLook as MakeupLook;
      console.log(chalk.cyan(`You selected: ${selectedLook.name}`));
      console.log(chalk.cyan("Look components:"));
      selectedLook.components.forEach((item, index) => {
        console.log(
          chalk.cyan(
            `${index + 1}. ${item.type} - ${item.brand} - ${item.name} - ${
              item.shade
            }`
          )
        );
      });
      askToGoToMainMenu();
    });
}

async function selectALook() {
  const { lookName } = await inquirer.prompt({
    name: "lookName",
    type: "input",
    message: chalk.yellow("What look are we going for today, darling?"),
  });
  const selectedLook = looks.find((look) => look.name === lookName);
  if (selectedLook) {
    console.log(chalk.cyan(`Look: ${selectedLook.name}`));
    selectedLook.components.forEach((item, index) => {
      console.log(
        chalk.cyan(
          `${index + 1}. ${item.type} - ${item.brand} - ${item.name} - ${
            item.shade
          }`
        )
      );
    });
  } else {
    console.log(chalk.red(`Darling, you haven't created that look yet.`));
  }
  askToGoToMainMenu();
}

async function askToGoToMainMenu() {
  const { returnToMainMenu } = await inquirer.prompt({
    type: "confirm",
    name: "returnToMainMenu",
    message: chalk.blue("Would you like to return to the main menu?"),
    default: true,
  });
  if (returnToMainMenu) {
    mainMenu();
  }
}

async function addItemToMakeupBag() {
  const itemDetails = await inquirer.prompt([
    {
      name: "type",
      type: "input",
      message: chalk.yellow("What kind of makeup item is it?"),
    },
    {
      name: "brand",
      type: "input",
      message: chalk.yellow("What brand is it?"),
    },
    {
      name: "name",
      type: "input",
      message: chalk.yellow("What's the product's name?"),
    },
    {
      name: "shade",
      type: "input",
      message: chalk.yellow("What's the shade?"),
    },
  ]);
  const newItem: MakeupItem = {
    type: itemDetails.type,
    brand: itemDetails.brand,
    name: itemDetails.name,
    shade: itemDetails.shade,
  };
  const exists = makeupBag.some(
    (item) =>
      item.type === newItem.type &&
      item.brand === newItem.brand &&
      item.name === newItem.name &&
      item.shade === newItem.shade
  );
  if (exists) {
    console.log(chalk.red("You already have that, no overconsumption👀"));
  } else {
    makeupBag.push(newItem);
    
    console.log(chalk.green("You have a new item, girl!"));
  }
  askToGoToMainMenu();
}

function viewMakeupBag() {
  console.log(chalk.magentaBright("Here's your Makeup Bag, darling:"));
  makeupBag.forEach((item, index) => {
    console.log(
      chalk.cyan(
        `${index + 1}. ${item.type} - ${item.brand} - ${item.name} - ${
          item.shade
        }`
      )
    );
  });
  askToGoToMainMenu();
}

async function combineTwoLooks() {
  const lookChoices = looks.map((look, index) => ({
    name: look.name,
    value: index,
  }));
  const { look1Index, look2Index } = await inquirer.prompt([
    {
      name: "look1Index",
      type: "list",
      message: chalk.yellow("What's the first look you want to combine?"),
      choices: lookChoices,
    },
    {
      name: "look2Index",
      type: "list",
      message: chalk.yellow("What's the second look you want to combine?"),
      choices: lookChoices,
    },
  ]);
  const look1 = looks[look1Index];
  const look2 = looks[look2Index];
  const combinedItems = [...look1.components, ...look2.components];
  const { newLookName } = await inquirer.prompt({
    name: "newLookName",
    type: "input",
    message: chalk.yellow("What do you want to call your combined creation?"),
  });
  const combinedLook: MakeupLook = {
    name: newLookName,
    components: combinedItems,
  };
  looks.push(combinedLook);
  looks.splice(Math.max(look1Index, look2Index), 1);
  looks.splice(Math.min(look1Index, look2Index), 1);
  console.log(chalk.green("And you're done!"));
  askToGoToMainMenu();
}
