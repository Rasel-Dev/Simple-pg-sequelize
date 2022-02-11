class Scheme {
  #userInput = {
    username: "Zubayer",
    pass: 1200,
    address: 3
  };

  constructor(schemeObj) {
    this.schemeObj = schemeObj;
    this.scheme = {
      validation: true,
    };
    this.validation = {
      validation: true,
    };
  }

  has(obj, value) {
    return Array.prototype.hasOwnProperty.call(obj, value);
  }

  schemeValidation() {
    const validProps = [
      "type",
      "required",
      "length",
      "unique",
      "mutable",
      "lowercase",
      "default",
    ];
    for (const key in this.schemeObj) {
      const name = this.schemeObj[key];

      if (!this.has(name, "type")) {
        this.scheme.validation = false;
        this.scheme["message"] = {
          ...this.scheme.message,
          [key]: "[type] is required",
        };
      } else {
        for (const objKey in name) {
          if (validProps.indexOf(objKey) === -1) {
            this.scheme.validation = false;
            this.scheme[key] = {
              ...this.scheme[key],
              [objKey]: `"${objKey}" is not a valid property`,
            };
          }
        }
      }
    }
  }

  save() {
    this.schemeValidation();
    if (!this.scheme.validation) {
      console.log(this.scheme, this.validation, "+schemeValidationFalse");
    } else {
      for (const schemeObjKey in this.schemeObj) {
        if (this.has(this.schemeObj[schemeObjKey], "required")) {
          if (
            this.has(this.#userInput, schemeObjKey) &&
            !this.#userInput[schemeObjKey]
          ) {
            this.validation.validation = false;
            this.validation[schemeObjKey] = `'${schemeObjKey}' is required`;
          } else {
            if (
              typeof this.#userInput[schemeObjKey] !==
              this.schemeObj[schemeObjKey].type.name.toLowerCase()
            ) {
              this.validation = {
                ...this.validation,
                validation: false,
                [schemeObjKey]: `Must be ${this.schemeObj[schemeObjKey].type.name} type value`,
              };
            }
          }
        } else {
            if (
                typeof this.#userInput[schemeObjKey] !==
                this.schemeObj[schemeObjKey].type.name.toLowerCase()
              ) {
                this.validation = {
                  ...this.validation,
                  validation: false,
                  [schemeObjKey]: `Must be ${this.schemeObj[schemeObjKey].type.name} type value`,
                };
              }
        }
      }
      console.log(this.scheme, this.validation);
    }
  }
}

const scheme = new Scheme({
  username: {
    type: String,
    required: true,
    length: 20,
    unique: true,
    mutable: false,
    lowercase: true,
  },
  pass: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
});

scheme.save();
