function objectInherit() {
  const oldObj = {
    name: "Old",
    print: function () {
      console.log(this.name);
    },
  };
  const newObj = { name: "New" };
  newObj.__proto__ = oldObj;
  newObj.print();
}

function constructorFunc() {
  {
    const oldObj = {
      name: "Old",
      print: function () {
        console.log(this.name);
      },
    };
    const newObj = Object.assign({}, oldObj);

    newObj.print();
  }

  {
    const getInitObj = () => ({
      name: "Init",
      print: function () {
        console.log(this.name);
      },
    });
    const oldObj = getInitObj();
    oldObj.name = "Old";
    const newObj = getInitObj();

    newObj.print();
  }

  {
    function getInitObj() {
      const output = {};
      // this = output;

      output.name = "Init";
      output.print = function () {
        console.log(output.name);
      };

      return output;
    }

    const oldObj = getInitObj();
    oldObj.name = "Old";
    const newObj = getInitObj();

    newObj.print();
  }

  {
    function InitObj() {
      this.name = "Init";
      this.print = function () {
        console.log(this.name);
      };
    }

    const oldObj = new InitObj();
    oldObj.name = "Old";
    const newObj = new InitObj();
    newObj.print();

    console.log(newObj.constructor === InitObj);
  }

  {
    function Animal() {
      this.type = "animal";
    }
    Animal.prototype.getType = function () {
      return this.type;
    };

    function Dog() {
      this.name = "dog";
    }

    Dog.prototype = new Animal();

    Dog.prototype.getName = function () {
      return this.name;
    };

    const xiaohuang = new Dog();

    console.log(xiaohuang.getName(), xiaohuang.getType()); // dog animal
  }
}

constructorFunc();
