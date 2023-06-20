// Importing Sound Effects
const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3");

introMusic.play()

const canvas = document.createElement("canvas");

document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");

const lightWeaponDamage = 10;
const heavyWeaponDamage = 15;
const hugeWeaponDamage = 50;
let difficulty = 2;
let PlayerScore = 0;

const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");

document.querySelector("input").addEventListener("click", (e) => {
    e.preventDefault()

    introMusic.pause()

    form.style.display = "none";
    scoreBoard.style.display = "block";

    const userValue = document.getElementById("difficulty").value;

    if (userValue === "easy") {
        setInterval(spawnEnemy, 2500)
        return (difficulty = 3)
    }

    if (userValue === "medium") {
        setInterval(spawnEnemy, 2000)
        return (difficulty = 5)
    }

    if (userValue === "hard") {
        setInterval(spawnEnemy, 1500)
        return (difficulty = 6)
    }

    if (userValue === "insane") {
        setInterval(spawnEnemy, 1000)
        return (difficulty = 7)
    }

})

//endscreen
const gameoverLoader=()=>{
    //creating endscreen elements
    const gameOverBanner = document.createElement("div");
    const gameOverBtn = document.createElement("button");
    const highScore = document.createElement("div");

    highScore.innerHTML = `High Score: ${
        localStorage.getItem("highScore") ? localStorage.getItem("highScore") :PlayerScore
    }`

    const oldScore = localStorage.getItem("highScore") && localStorage.getItem("highScore");

    if(oldScore<PlayerScore){
        localStorage.setItem("highScore",PlayerScore)
        //updating highscore 
        highScore.innerHTML = `High Score: ${PlayerScore}`
    }

    //adding text into button
    gameOverBtn.innerHTML = "Play Again";

    gameOverBanner.appendChild(highScore);
    gameOverBanner.appendChild(gameOverBtn);

    //making reload on clicking play again button
    gameOverBtn.onclick=()=>{
        window.location.reload();
    }

gameOverBanner.classList.add("gameover");

document.querySelector("body").appendChild(gameOverBanner);

}


playerPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle = this.color;
        context.fill()
    }
}
// -----------------------

class Weapon {
    constructor(x, y, radius, color, velocity, damage) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.damage = damage;
    }
    draw() {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle = this.color;
        context.fill()
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

//creating huge weapon
class HugeWeapon {
    constructor(x, y, color, damage) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.damage = damage;
    }
    draw() {
        context.beginPath()
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, 100, canvas.height)
        context.fill()
    }
    update() { 
        this.draw();
        this.x += 20;
    }
}

// ------------------------

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle = this.color;
        context.fill()
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

// ------------------------
//creating particle class
const friction = 0.98
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw() {
        context.save()
        context.globalAlpha = this.alpha;
        context.beginPath()
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle = this.color;
        context.fill()
        context.restore();

    }
    update() {
        this.draw();
        this.velocity.x *= friction
        this.velocity.y *= friction

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01
    }
}


//--------------------------
const bicky = new Player(playerPosition.x, playerPosition.y, 10, "white")

const weapons = [];
const enemies = [];
const particles = [];
const hugeweapons = [];

function spawnEnemy() {
    const enemySize = Math.random() * (30 - 5) + 5;

    const enemyColor = `hsl(${Math.floor(Math.random() * 360)},100%,50%)`
    let random;

    if (Math.random() < 0.5) {
        random = {
            x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
            y: Math.random() * canvas.height
        }

    } else {
        random = {
            x: Math.random() * canvas.width,
            y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize
        }
    }

    const myAngle = Math.atan2(
        canvas.height / 2 - random.y,
        canvas.width / 2 - random.x
    )

    const velocity = {
        x: Math.cos(myAngle) * difficulty,
        y: Math.sin(myAngle) * difficulty
    }

    enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity))
}
let animationId;

function animation() {
    animationId = requestAnimationFrame(animation)

    scoreBoard.innerHTML = `Score:${PlayerScore}`

    context.fillStyle = `rgba(49,49,49,0.2)`
    context.fillRect(0, 0, canvas.width, canvas.height)

    bicky.draw();

    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1)
        }
        else {
            particle.update()
        }
    })

    weapons.forEach((weapon, weaponIndex) => {
        weapon.update()

        if (weapon.x + weapon.radius < 1 || weapon.y + weapon.radius < 1 ||
            weapon.x - weapon.radius > canvas.width || weapon.y - weapon.radius > canvas.height
        ) {
            weapons.splice(weaponIndex, 1)
        }
    })

    hugeweapons.forEach((hugeWeapon, hugeWeaponIndex) => {
        if (hugeWeapon.x > canvas.width) {
            hugeweapons.splice(hugeWeaponIndex, 1)
        } else {
            hugeWeapon.update()
        }
    })


    enemies.forEach((enemy, enemyIndex) => {
        enemy.update()

        const distanceBetweenPlayerAndEnemy = Math.hypot(
            bicky.x - enemy.x,
            bicky.y - enemy.y
        )
        if (distanceBetweenPlayerAndEnemy - bicky.radius - enemy.radius < 1) {
            cancelAnimationFrame(animationId)
            gameOverSound.play()
            hugeWeaponSound.pause()
            shootingSound.pause()
            heavyWeaponSound.pause()
            killEnemySound.pause()
            return gameoverLoader();
        }


        hugeweapons.forEach((hugeWeapon) => {
            const distanceBetweenEnemyAndHugeWeapon = hugeWeapon.x - enemy.x

            if (distanceBetweenEnemyAndHugeWeapon <= 100 && distanceBetweenEnemyAndHugeWeapon >= -100) {
                PlayerScore += 10;
                scoreBoard.innerHTML = `Score:${PlayerScore}`
                setTimeout(() => {
                    killEnemySound.play()
                    enemies.splice(enemyIndex, 1)
                }, 0);

            }

        })

        weapons.forEach((weapon, weaponIndex) => {
            const distanceBetweenEnemyAndWeapon = Math.hypot(
                weapon.x - enemy.x,
                weapon.y - enemy.y
            )

            //reduceing enemy size on hit
            if (distanceBetweenEnemyAndWeapon - weapon.radius - enemy.radius < 1) {


                if (enemy.radius > weapon.damage + 8) {
                    gsap.to(enemy, { radius: enemy.radius - weapon.damage })

                    setTimeout(() => {
                        weapons.splice(weaponIndex, 1)
                    }, 0);
                }
                //Removing enemy on hit if they are below 18
                else {
                    for (let i = 0; i < enemy.radius * 2; i++) {
                        particles.push(new Particle(weapon.x, weapon.y, Math.random() * 2, enemy.color, {
                            x: (Math.random() - 0.5) * (Math.random() * 5),
                            y: (Math.random() - 0.5) * (Math.random() * 5)
                        }))
                    }
                    PlayerScore += 10

                    scoreBoard.innerHTML = `Score:${PlayerScore}`
                    setTimeout(() => {
                        killEnemySound.play()
                        enemies.splice(enemyIndex, 1)

                        weapons.splice(weaponIndex, 1)
                    }, 0);
                }
            }
        })
    })
}


canvas.addEventListener("click", (e) => {

    shootingSound.play()

    const myAngle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2
    )

    const velocity = {
        x: Math.cos(myAngle) * 6.5,
        y: Math.sin(myAngle) * 6.5
    }

    weapons.push(new Weapon(canvas.width / 2, canvas.height / 2, 6, "white", velocity, lightWeaponDamage))
})

//for Heavy weapon
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    if (PlayerScore <= 0) {
        return;
    }
    heavyWeaponSound.play()

    // decreasing Player score using heavy weapon
    PlayerScore -= 2;
    scoreBoard.innerHTML = `Score:${PlayerScore}`

    const myAngle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2
    )

    const velocity = {
        x: Math.cos(myAngle) * 3,
        y: Math.sin(myAngle) * 3
    }

    weapons.push(new Weapon(canvas.width / 2, canvas.height / 2, 15, "cyan", velocity, heavyWeaponDamage))
})


addEventListener("keypress", (e) => {
    if (e.key === " ") {
        if (PlayerScore < 20) return;
    hugeWeaponSound.play()
        
        // decreasing Player score using huge weapon
        PlayerScore -= 20;
        scoreBoard.innerHTML = `Score:${PlayerScore}`

        hugeweapons.push(new HugeWeapon(0, 0, "rgba(47,255,0,0.8)", hugeWeaponDamage))
    }
})

addEventListener("contextmenu", (e) => {
    e.preventDefault()
})

addEventListener("resize", () => {
window.location.reload()
})

animation()
