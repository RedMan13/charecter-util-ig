/** 
 * modes:
 *   "normal",
 *   "bold",
 *   "italic",
 *   "italic bold"
 */
const uppercaseAlphabet = require('./uppercase.json')
const lowercaseAlphabet = require('./lowercase.json')

const charecters = require('./charecters.json')
const truthTables = {}

for (const start in charecters.alphabets) {
    const config = charecters.alphabets[start]
    const workingAlphbet = config.lowercase ? lowercaseAlphabet : uppercaseAlphabet
    const alphabetStart = Number(start)
    const rangeLength = config.range.length / 2
    let myAlphabet = []
    for (let index = 0; index < rangeLength; index++) {
        const rangeStartIndex = index * 2
        const rangeEndIndex = rangeStartIndex + 1
        const rangeStart = config.range[rangeStartIndex]
        const rangeEnd = config.range[rangeEndIndex]
        myAlphabet = myAlphabet.concat(workingAlphbet.slice(rangeStart, rangeEnd))
    }
    const truthTable = Object.fromEntries(myAlphabet.map((letter, index) => ([
        letter, 
        charecters.letters[index + alphabetStart]
    ])))
    if (truthTables[config.name]) {
        Object.assign(truthTables[config.name], truthTable)
    } else {
        truthTables[config.name] = truthTable
    }
}

// merge truth tables so that every table points to the other
for (const tableName in truthTables) {
    const table = truthTables[tableName]
    for (const otherTableName in truthTables) {
        if (tableName === otherTableName) continue
        const otherTable = truthTables[otherTableName]
        for (const character in otherTable) {
            const converted = otherTable[character]
            const mainCharacter = table[character]
            if (table[converted]) continue
            table[converted] = mainCharacter
        }
    }
}

module.exports = (mode, inputText) => {
    if (!mode || !inputText) {
        throw new Error(!mode ? 'missing mode type' : 'missing input text')
    }
    
    if (!truthTables[mode]) {
        throw new Error(`unknown mode type "${mode}", known modes are ${Object.keys(truthTables).map(name => (`"${name}"`))}`)
    }
    
    let output = ''
    const truthTable = truthTables[mode]
    for (const letter of inputText.split('')) {
        output += truthTable[letter] || letter 
    }
    return output
}