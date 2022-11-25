async function loadInteractions(client) {
    const { fileLoader } = require("../functions/fileLoader");

    await client.events.clear();
    const buttonFiles = await fileLoader("buttons");
    const modalFiles = await fileLoader("modals");
    const selectMenuFiles = await fileLoader("selectMenus");
    const eventFiles = await fileLoader("events")
    let buttonCount = 0, modalCount = 0, selectMenuCount = 0, eventCount = 0

    buttonFiles.forEach((file) => {
        const button = require(file);
        if (!button.id) return;
        client.buttons.set(button.id, button);
        buttonCount++
    });

    modalFiles.forEach((file) => {
        const modal = require(file);
        if (!modal.id) return;
        client.modals.set(modal.id, modal);
        modalCount++
    });

    selectMenuFiles.forEach((file) => {
        const selectMenu = require(file);
        client.selectMenus.set(selectMenu.id, selectMenu);
        selectMenuCount++
    });

    eventFiles.forEach((file) => {
        const event = require(file);
        const execute = async (...args) => await event.execute(...args, client);
        client.events.set(event.id, execute)
        if (event.rest) {
            if (event.once) client.rest.once(event.id, execute);
            else client.rest.on(event.id, execute);
        } else {
            if (event.once) client.once(event.id, execute);
            else client.on(event.id, execute);
        }
        eventCount++
    })
    return console.log(`Loaded ${buttonCount} Buttons, ${modalCount} Modals, ${selectMenuCount} Select Menus and ${eventCount} Events`)
}


module.exports = { loadInteractions };
