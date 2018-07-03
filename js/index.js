const humanPrintableCharacters = {
    9: 'TAB',
    32: 'SPACE'
}
new Vue({
    el: '#app',
    data: {
        input: '',
        output: [],
        announce: []
    },
    watch: {
        input: function() {
            // /* Trim whitespaces from begin and end of string */
            // this.input = rtrim(ltrim(this.input))

            /* Reset announce messages */
            this.announce = []

            /* Check if input is empty */
            if (!this.input || !this.input.length) {
                return
            }

            /* Check if input is in JSON format */
            // if (!this.input.startsWith('{')) {
            //     this.announce.push({ error: true, msg: "JSON needs to start with an '{'" })
            // }
            // if (!this.input.endsWith('}')) {
            //     this.announce.push({ error: true, msg: "JSON needs to end with an '}'" })
            // }

            const parsedInput = tryParse(this.input)
            if (parsedInput.err) {
                const errorMargin = 50 //TODO: Input

                const pos = parsedInput.err.pos
                const preErrorPos = Math.max(pos - errorMargin, 0)
                const afterErrorPos = Math.min(pos + errorMargin, this.input.length - 1)

                this.output = [
                    {
                        type: 'start',
                        text: this.input.slice(0, preErrorPos)
                    },
                    {
                        type: 'preError',
                        text: this.input.slice(preErrorPos, pos)
                    },
                    {
                        type: 'atError',
                        text: this.input.slice(pos, pos + 1)
                    },
                    {
                        type: 'afterError',
                        text: this.input.slice(pos + 1, afterErrorPos)
                    },
                    {
                        type: 'end',
                        text: this.input.slice(afterErrorPos + 1)
                    }
                ]

                const errCharCode = this.input.charCodeAt(pos)
                let humanChar = this.input[pos]
                if (humanPrintableCharacters[errCharCode]) {
                    humanChar = `<${humanPrintableCharacters[errCharCode]}>`
                }

                this.announce.push({
                    error: true,
                    msg: `Unexpected token ${humanChar} in JSON at position ${pos}`
                })
            } else {
                this.output = [
                    {
                        type: 'input',
                        text: this.input
                    }
                ]

                /* When no errors occured its parsed correctly */
                if (!this.announce || !this.announce.length) {
                    this.announce.push({ error: false, msg: 'Parsed successfully' })
                }
            }
        }
    }
})

/**
 *
 * @param {{'data'}: any|null, {'err'}: any|null} data
 */
function tryParse(data) {
    const res = {}
    try {
        res.data = JSON.parse(data)
    } catch (e) {
        const position = Number(e.message.split('position ')[1])
        res.err = {
            pos: position,
            msg: e.message
        }
    }
    return res
}

function ltrim(str) {
    if (str == null) return str
    return str.replace(/^\s+/g, '')
}

function rtrim(str) {
    if (str == null) return str
    return str.replace(/\s+$/g, '')
}
