function has(obj, value) {
    return Array.prototype.hasOwnProperty.call(obj, value);
}

const schemeObj = {
    username: {
        type: String,
        required: true,
        name: "Zubayer"
    },
    pass: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
    }
}

const userInput = {
    username: 40,
    pass: "rasel123",
    name: 'some'
}

const schemeValidation = {
    scheme: {
        validation: true
    },
    validation: {
        validation: true
    }
};

const validProps = ['type', 'required', 'unique']
for (const key in schemeObj) {
    const name = schemeObj[key];

    if (!has(name, 'type')) {
        schemeValidation.scheme.validation = false;
        schemeValidation.scheme['message'] = {
            ...schemeValidation.scheme.message,
            [key]: "[type] is required"
        }
    } else {
        for (const objKey in name) {
    
            if (validProps.indexOf(objKey) === -1) {
                schemeValidation.scheme.validation = false;
                schemeValidation.scheme[key] = {
                    ...schemeValidation.scheme[key],
                    [objKey]: `"${objKey}" is not valid property`
                }
            }
        }
    }

}

if (!schemeValidation.scheme.validation) {
    console.log(schemeValidation);
} else {
    for (const schemeObjKey in schemeObj) {
        if (has(schemeObj[schemeObjKey], "required")) {
            if (has(userInput, schemeObjKey) && !userInput[schemeObjKey]) {
                schemeValidation.validation.validation = false;
                schemeValidation.validation[schemeObjKey] = `'${schemeObjKey}' is required`;
            } else {
                if (typeof userInput[schemeObjKey] !== schemeObj[schemeObjKey].type.name.toLowerCase()) {

                    schemeValidation.validation = {
                        ...schemeValidation.validation,
                        validation: false,
                        [schemeObjKey]: `Must be ${schemeObj[schemeObjKey].type.name} type value`
                    }
                }
                
            }
        } 
    }
}

console.log(schemeValidation);
