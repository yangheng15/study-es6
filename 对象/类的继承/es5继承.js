function Animal(age, name) {
    this.age = age,
    this.name = name;
}

Animal.prototype.print = function() {
    console.log(this.name)
}

function Dog() {
    Animal.call(this, 18, '小明')
}
Object.setPrototypeOf(Dog.prototype, Animal.prototype);

const dog = new Dog()
console.log(dog);