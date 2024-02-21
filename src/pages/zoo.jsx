import React, { useState } from "react";

//Random number generator
//Min is used to for newhealth check
const getRandom = (min, max) => Math.random() * (max - min) + min;

const Animal = ({ type, health, status }) => {
  let textColor = "text-green-500"; //if alive
  if (status === "Dead") {
    textColor = "text-red-500";
  } else if (status === "Cannot Walk") {
    textColor = "text-yellow-500";
  }

  return (
    <div className="p-4 border-2 border-[#c5b4e3] rounded-lg shadow-lg transition-transform duration-200 hover:scale-105">
      <h2 className="text-xl font-bold">{type}</h2>
      <p>Health: {health.toFixed(2)}%</p>
      <p>
        Status: <span className={`${textColor} font-semibold`}>{status}</span>
      </p>
    </div>
  );
};

const Zoo = () => {
  const initialAnimals = {
    monkeys: new Array(5).fill({ health: 100, status: "Alive" }),
    giraffes: new Array(5).fill({ health: 100, status: "Alive" }),
    elephants: new Array(5).fill({
      health: 100,
      status: "Alive",
      hoursBelowThreshold: 0,
    }),
  };

  const [animals, setAnimals] = useState(initialAnimals);
  const [time, setTime] = useState(0);

  const animalNames = {
    monkeys: "Monkey",
    giraffes: "Giraffe",
    elephants: "Elephant",
  };

  const minimumHealthRequired = {
    Monkey: 30,
    Giraffe: 50,
    Elephant: 70,
  };

  const updateHealth = (animal, type) => {
    let newHealth = Math.max(
      0,
      animal.health - (getRandom(0, 20) * animal.health) / 100
    );
    let newStatus = animal.status;

    if (
      (type === "Monkey" && newHealth < 30) ||
      (type === "Giraffe" && newHealth < 50)
    ) {
      // Sets health to zero if below required with status updated
      newStatus = "Dead";
    } else if (type === "Elephant") {
      let hoursBelowThreshold = animal.hoursBelowThreshold;

      if (newHealth < 70) {
        hoursBelowThreshold += 1;
        if (hoursBelowThreshold === 1) {
          newStatus = "Cannot Walk";
        } else if (hoursBelowThreshold > 1) {
          newStatus = "Dead";
        }
      } else {
        hoursBelowThreshold = 0; // Reset if health is above 70
        newStatus = "Alive";
      }

      return {
        ...animal,
        health: newHealth,
        status: newStatus,
        hoursBelowThreshold,
      };
    }

    // Return the updated object for monkeys and giraffes or if no status change for elephants
    return {
      ...animal,
      health: newHealth,
      status: newStatus,
    };
  };

  const passTime = () => {
    setTime((prevTime) => {
      const nextTime = (prevTime + 1) % 24;
      return nextTime;
    });
    setAnimals({
      monkeys: animals.monkeys.map((animal) => updateHealth(animal, "Monkey")),
      giraffes: animals.giraffes.map((animal) =>
        updateHealth(animal, "Giraffe")
      ),
      elephants: animals.elephants.map((animal) =>
        updateHealth(animal, "Elephant")
      ),
    });
  };

  //Checking for if animal is still alive
  const isAliveCheck = (type, health) => {
    return health >= minimumHealthRequired[type];
  };

  //Feeds the animal uses a condition check where if isAlive is true adds health between 10-25 if isAlive is false keeps health value the same.

  const feedAnimals = () => {
    const monkeyFeedNumber = getRandom(10, 25);
    const giraffeFeedNumber = getRandom(10, 25);
    const elephantFeedNumber = getRandom(10, 25);

    const feed = (type, feedNumber) => (animal) => {
      //Checks if animal can be fed including elephant cant walk
      let canBeFed =
        isAliveCheck(type, animal.health) ||
        (type === "Elephant" && animal.status === "Cannot Walk");

      if (!canBeFed) {
        return animal; // If it cannot be fed, return the animal unchanged.
      }

      // Calculate new health max value 100
      const newHealth = Math.min(
        100,
        animal.health + (feedNumber * animal.health) / 100
      );

      // Checks if elephant health is above 70. If so status changes to Alive
      let newStatus = animal.status;
      if (type === "Elephant" && newHealth > 70) {
        newStatus = "Alive";
      }

      // Return the updated animal object with new health and possibly updated status.
      return {
        ...animal,
        health: newHealth,
        status: newStatus,
      };
    };

    setAnimals({
      monkeys: animals.monkeys.map(feed("Monkey", monkeyFeedNumber)),
      giraffes: animals.giraffes.map(feed("Giraffe", giraffeFeedNumber)),
      elephants: animals.elephants.map(feed("Elephant", elephantFeedNumber)),
    });
  };

  return (
    <main className=" max-w-4xl mx-auto my-8 p-4 ">
      <div className="bg-white mx-4 sm:mx-10 md:mx-20 lg:mx-40 rounded-[12px]">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center underline mb-6 py-6">
          Zoo Simulator
        </h1>
      </div>
      <div className="bg-white p-10 rounded-[12px] pt-10 ">
        <div className="flex justify-around mb-4">
          <button
            className="bg-blue-700 hover:bg-[#0E16AF] text-white font-bold py-3 px-4 rounded-[12px] shadow-lg transition-transform duration-200 hover:scale-105"
            onClick={passTime}
          >
            Pass One Hour
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-[12px] shadow-lg transition-transform duration-200 hover:scale-105"
            onClick={feedAnimals}
          >
            Feed Animals
          </button>
        </div>
        <h2 className="text-2xl font-semibold mb-4">
          Time: {`${time.toString().padStart(2, "0")}:00`}
        </h2>

        {Object.entries(animals).map(([type, animalArray], index) => (
          <div key={index}>
            <h2 className="text-xl font-bold capitalize mb-2 underline underline-offset-2 decoration-2">
              {type}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8 capitalize">
              {animalArray.map((animal, index) => (
                <Animal
                  key={index}
                  type={animalNames[type]}
                  health={animal.health}
                  status={animal.status}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Zoo;
