var person = (function () {
    //private
    var age = 23;

    var getAge = function () {
        return age;
    };
    var growOlder = function () {
        age++;
    };
    return {
        //public

        name: "Artem",
        getAge: getAge,
        growOlder: growOlder

    };

}());

console.log(person.name);
// console.log(person.age)l

// mixins

function mixin(receiver, supplier) {
    for(var property in supplier) {
        if(supplier.hasOwnProperty(property)) {
            receiver[property] = supplier[property];
        }
    }
    return receiver;
}