"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program.version("1").description("LOOKBOOK CLI");
const makeupBagPath = path_1.default.resolve(__dirname, "data/makeupItems.json");
const makeupBag = JSON.parse(fs_1.default.readFileSync(makeupBagPath, "utf-8"));
const looks = [];
function displayHeader() {
    console.log(chalk_1.default.yellowBright.bgBlack.bold("Welcome to the LookBook, Diva ✨"));
}
function mainMenu() {
    return __awaiter(this, void 0, void 0, function* () {
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
        const answer = yield inquirer_1.default.prompt({
            name: "choice",
            type: "list",
            message: chalk_1.default.blue("What do you want to do, darling?✨"),
            choices,
        });
        switch (answer.choice) {
            case "Create a Look":
                yield createLook();
                break;
            case "View all looks":
                yield viewAllLooks();
                break;
            case "Select a Look":
                yield selectALook();
                break;
            case "Add item to Makeup Bag":
                yield addItemToMakeupBag();
                break;
            case "View Makeup Bag":
                yield viewMakeupBag();
                break;
            case "Combine two looks":
                yield combineTwoLooks();
                break;
            case "Exit":
                console.log(chalk_1.default.green("See you later darling!"));
                process.exit(0);
                break;
            default:
                console.log(chalk_1.default.red("I think we may have gotten lost darling"));
                mainMenu();
        }
    });
}
mainMenu();
program.parse(process.argv);
function createLook() {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = yield inquirer_1.default.prompt({
            name: "name",
            type: "input",
            message: chalk_1.default.yellow("What's the new look, diva?"),
        });
        const lookItems = [];
        let addItem = false;
        while (!addItem) {
            const { itemIndex } = yield inquirer_1.default.prompt({
                name: "itemIndex",
                type: "list",
                message: chalk_1.default.yellow("What do you want to make your look with?"),
                choices: makeupBag.map((item, index) => ({
                    name: `${item.type} - ${item.brand} - ${item.name} - ${item.shade}`,
                    value: index,
                })),
            });
            lookItems.push(makeupBag[itemIndex]);
            const { continueAdding } = yield inquirer_1.default.prompt({
                name: "continueAdding",
                type: "confirm",
                message: chalk_1.default.yellow("Is that all your look is made of, darling?"),
                default: true,
            });
            addItem = continueAdding;
        }
        const newLook = { name, components: lookItems };
        looks.push(newLook);
        console.log(chalk_1.default.green(`Darling, your ${name} look was successfully created!`));
        mainMenu();
    });
}
function viewAllLooks() {
    console.log(chalk_1.default.magentaBright("Here are all your looks, Fashionista!"));
    const choices = looks.map((look, index) => ({
        name: `${index + 1}. ${look.name}`,
        value: look,
    }));
    inquirer_1.default
        .prompt([
        {
            type: "list",
            name: "selectedLook",
            message: chalk_1.default.blue("Select a look to view more details:"),
            choices,
        },
    ])
        .then((answers) => {
        const selectedLook = answers.selectedLook;
        console.log(chalk_1.default.cyan(`You selected: ${selectedLook.name}`));
        console.log(chalk_1.default.cyan("Look components:"));
        selectedLook.components.forEach((item, index) => {
            console.log(chalk_1.default.cyan(`${index + 1}. ${item.type} - ${item.brand} - ${item.name} - ${item.shade}`));
        });
        askToGoToMainMenu();
    });
}
function selectALook() {
    return __awaiter(this, void 0, void 0, function* () {
        const { lookName } = yield inquirer_1.default.prompt({
            name: "lookName",
            type: "input",
            message: chalk_1.default.yellow("What look are we going for today, darling?"),
        });
        const selectedLook = looks.find((look) => look.name === lookName);
        if (selectedLook) {
            console.log(chalk_1.default.cyan(`Look: ${selectedLook.name}`));
            selectedLook.components.forEach((item, index) => {
                console.log(chalk_1.default.cyan(`${index + 1}. ${item.type} - ${item.brand} - ${item.name} - ${item.shade}`));
            });
        }
        else {
            console.log(chalk_1.default.red(`Darling, you haven't created that look yet.`));
        }
        askToGoToMainMenu();
    });
}
function askToGoToMainMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const { returnToMainMenu } = yield inquirer_1.default.prompt({
            type: "confirm",
            name: "returnToMainMenu",
            message: chalk_1.default.blue("Would you like to return to the main menu?"),
            default: true,
        });
        if (returnToMainMenu) {
            mainMenu();
        }
    });
}
function addItemToMakeupBag() {
    return __awaiter(this, void 0, void 0, function* () {
        const itemDetails = yield inquirer_1.default.prompt([
            {
                name: "type",
                type: "input",
                message: chalk_1.default.yellow("What kind of makeup item is it?"),
            },
            {
                name: "brand",
                type: "input",
                message: chalk_1.default.yellow("What brand is it?"),
            },
            {
                name: "name",
                type: "input",
                message: chalk_1.default.yellow("What's the product's name?"),
            },
            {
                name: "shade",
                type: "input",
                message: chalk_1.default.yellow("What's the shade?"),
            },
        ]);
        const newItem = {
            type: itemDetails.type,
            brand: itemDetails.brand,
            name: itemDetails.name,
            shade: itemDetails.shade,
        };
        const exists = makeupBag.some((item) => item.type === newItem.type &&
            item.brand === newItem.brand &&
            item.name === newItem.name &&
            item.shade === newItem.shade);
        if (exists) {
            console.log(chalk_1.default.red("You already have that, no overconsumption👀"));
        }
        else {
            makeupBag.push(newItem);
            console.log(chalk_1.default.green("You have a new item, girl!"));
        }
        askToGoToMainMenu();
    });
}
function viewMakeupBag() {
    console.log(chalk_1.default.magentaBright("Here's your Makeup Bag, darling:"));
    makeupBag.forEach((item, index) => {
        console.log(chalk_1.default.cyan(`${index + 1}. ${item.type} - ${item.brand} - ${item.name} - ${item.shade}`));
    });
    askToGoToMainMenu();
}
function combineTwoLooks() {
    return __awaiter(this, void 0, void 0, function* () {
        const lookChoices = looks.map((look, index) => ({
            name: look.name,
            value: index,
        }));
        const { look1Index, look2Index } = yield inquirer_1.default.prompt([
            {
                name: "look1Index",
                type: "list",
                message: chalk_1.default.yellow("What's the first look you want to combine?"),
                choices: lookChoices,
            },
            {
                name: "look2Index",
                type: "list",
                message: chalk_1.default.yellow("What's the second look you want to combine?"),
                choices: lookChoices,
            },
        ]);
        const look1 = looks[look1Index];
        const look2 = looks[look2Index];
        const combinedItems = [...look1.components, ...look2.components];
        const { newLookName } = yield inquirer_1.default.prompt({
            name: "newLookName",
            type: "input",
            message: chalk_1.default.yellow("What do you want to call your combined creation?"),
        });
        const combinedLook = {
            name: newLookName,
            components: combinedItems,
        };
        looks.push(combinedLook);
        looks.splice(Math.max(look1Index, look2Index), 1);
        looks.splice(Math.min(look1Index, look2Index), 1);
        console.log(chalk_1.default.green("And you're done!"));
        askToGoToMainMenu();
    });
}
