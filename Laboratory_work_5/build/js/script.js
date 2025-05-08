function triangle(value1 = 0, type1 = "", value2 = 0, type2 = ""){
        
    if(type1 === "" || type2 === ""){
        console.log("Введіть правильну кількість параметрів трикутника та їх значень.");
        return "failed";
    }

    if (typeof value1 != 'number' || typeof value2 != 'number') {
        console.log("Значення параметрів трикутника повинні бути задані числом");
        return "failed";
    } 

    const validTypes = ["leg", "hypotenuse", "adjacent angle", "opposite angle", "angle"];

    if (!validTypes.includes(type1) || !validTypes.includes(type2)) {
        console.log("Будь ласка, перечитайте інструкцію та введіть правильні параметри трикутника.");
        return "failed";
    }

    if(type1 === type2 && type1 != "leg"){
        console.log("Ви ввели несумісну пару параметрів трикутника.");
        return "failed";
    }

    if((type1 === "angle" && type2 != "hypotenuse")||(type2 === "angle" && type1 != "hypotenuse")){
        console.log("Ви ввели несумісну пару параметрів трикутника. Якщо кут — один з параметрів, то іншим обовязково повинна бути гіпотенуза.");
        return "failed";
    }

    if((type1 === "opposite angle" && type2 === "adjacent angle")||(type2 === "opposite angle" && type1 === "adjacent angle")){
        console.log("Ви ввели несумісну пару параметрів трикутника.");
        return "failed";
    }

    if((type1 === "adjacent angle" && type2 === "hypotenuse")||
    (type2 === "adjacent angle" && type1 === "hypotenuse")||
    (type1 === "opposite angle" && type2 === "hypotenuse")||
    (type2 === "opposite angle" && type1 === "hypotenuse")){
        console.log("Ви ввели несумісну пару параметрів трикутника.");
        return "failed";
    }

    if (value1 <= 0 || value2 <= 0 ) {
        console.log("Значення елементів повинні бути більшими за нуль.");
        return "failed";
    }

    let hypotenuse, leg, otherLeg, alpha, beta;
    
    if (type1 === "leg" && type2 === "leg"){
        leg = Math.min(value1, value2);
        otherLeg = Math.max(value1, value2);
        hypotenuse = Math.sqrt(leg * leg + otherLeg * otherLeg);
        beta = Math.atan(leg / otherLeg) * (180 / Math.PI);
        alpha = 90 - beta;
    }
    else if (type1 === "leg" || type2 === "leg"){
        if (type1 === "hypotenuse" || type2 === "hypotenuse"){
            leg = (type1 === "leg") ? value1 : value2;
            hypotenuse = (type1 === "hypotenuse") ? value1 : value2;
            if(hypotenuse < leg){
                console.log("Катет не може бути більшим за гіпотенузу.");
                return "failed";
            }
            else{
                otherLeg = Math.sqrt(hypotenuse * hypotenuse - leg * leg);
                beta = Math.asin(leg / hypotenuse) * (180 / Math.PI);
                alpha = 90 - beta;
            }
        }
        if (type1 === "opposite angle" || type2 === "opposite angle"){
            leg = (type1 === "leg") ? value1 : value2;
            beta = (type1 === "opposite angle") ? value1 : value2;
            hypotenuse = leg / Math.sin(beta * (Math.PI / 180));
            otherLeg = Math.sqrt(hypotenuse * hypotenuse - leg * leg);
            alpha = 90 - beta;
        }
        if (type1 === "adjacent angle" || type2 === "adjacent angle"){
            leg = (type1 === "leg") ? value1 : value2;
            alpha = (type1 === "adjacent angle") ? value1 : value2;
            otherLeg = leg * Math.tan(alpha * (Math.PI / 180));
            hypotenuse = leg / Math.cos(alpha * (Math.PI / 180));
            beta = 90 - alpha;
        }
    }
    else if ((type1 === "hypotenuse" && type2 === "angle") || (type1 === "angle" && type2 === "hypotenuse")) {
        hypotenuse = (type1 === "hypotenuse") ? value1 : value2;
        alpha = (type1 === "angle") ? value1 : value2;
        leg = hypotenuse * Math.cos(alpha * (Math.PI / 180));
        otherLeg = hypotenuse * Math.sin(alpha * (Math.PI / 180));
        beta = 90 - alpha;
    }  
    
    if(beta > 90 || alpha > 90){
        console.log("У прямокутному трикутнику не може бути тупого кута.");
        return "failed";
    }
    
    if(beta == 90 || alpha == 90){
        console.log("У прямокутному трикутнику не може бути двох прямих кутів.");
        return "failed";
    }

    console.log(`a = ${leg}\nb = ${otherLeg}\nc = ${hypotenuse}\nalpha = ${alpha}°\nbeta = ${beta}°`);
    return "success";
}

console.log("\tІНСТРУКЦІЯ");
console.log("Дана програма дозволяє розв'язати прямокутний трикутник, тобто обчислити всі його невідомі сторони та кути.");
console.log("Для цього Вам потрібно написати команду triangle(значення1, параметр1, значення2, параметр2), де 'параметри' — це те, що Вам відомо у трикутнику, а 'значання' — числове представлення значень відомих Вам параметрів.");
console.log("Для обчислення трикутника достатньо мати три параметри. Оскільки Ви обчислюєте прямокутний трикутник, то один з кутів вже відомий — 90°.");
console.log("Відповідно два інших параметри Ви повинні вказати в дужках при виклику команди triangle.");
console.log("Ось позначення параметрів та пояснення до них:\n\t• leg — катет\n\t• hypotenuse — гіпотенуза\n\t• adjacent angle — прилеглий до катета кут\n\t• opposite angle — протилежний до катета кут\n\t• angle — один з двох гострих кутів (коли задана гіпотенуза)");
console.log("");
console.log('Приклад виклику команди triangle:\n\ttriangle(13, "leg", 25, "opposite angle")');
console.log("В даному випадку Вам відомо три параметри:\n\t• прямий кут, який одразу відомий і який задавати не потрібно\n\t• катет, який дорівнює 13\n\t• протилежний до катета кут, який дорівнює 25°");
console.log("");
console.log(" !!!\nВажливо пам'ятати про правильну сумісність параметрів — якщо Ви задасте два кути, або прилеглий до катета кут і гіпотенузу, то програма не спрацює, оскільки в першому випадку відомі тільки кути, а цього не достатньо для розв'язання трикутника. В другому випадку «прилеглий до катета кут» так і 'кричить' про важливість наявності катета, як другого параметра. Хоча було б круто, якби можна було розв'язати трикутник, маючи дві гіпотенузи :) \nАле так не працює, тому будьте уважні при передачі параметрів.");
console.log("()_()\n(•.•)\tБажаю успіхів!\n/ >♥");
