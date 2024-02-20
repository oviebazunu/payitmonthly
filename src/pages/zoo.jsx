import React, { useState } from "react";

// Helper function to generate a random number within a range
const getRandom = (min, max) => Math.random() * (max - min) + min;

const Animal = ({ type, health, status }) => {
  let textColor = "text-green-500"; // Default color for "Alive"
  if (status === "Dead") {
    textColor = "text-red-500";
  } else if (status === "Cannot Walk") {
    textColor = "bright-yellow"; // Example, adjust as needed
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-lg">
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
    let newStatus = animal.status; // Assume status stays the same unless conditions below trigger a change

    // Adjust health and status for monkeys and giraffes
    if (
      (type === "Monkey" && newHealth < 30) ||
      (type === "Giraffe" && newHealth < 50)
    ) {
      newHealth = 0; // Set health to 0 if below threshold
      newStatus = "Dead"; // Update status to dead
    } else if (type === "Elephant") {
      let hoursBelowThreshold = animal.hoursBelowThreshold;

      if (newHealth < 70) {
        hoursBelowThreshold += 1;
        if (hoursBelowThreshold === 1) {
          newStatus = "Cannot Walk";
        } else if (hoursBelowThreshold > 1) {
          newStatus = "Dead";
          newHealth = 0; // Elephants also get their health set to 0 if dead
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
      status: newStatus, // Make sure to update the status in the return object
    };
  };

  const passTime = () => {
    setTime(time + 1);
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

  //feeds the animal uses a condition check where if isAlive is true adds health between 10-25 if isAlive is false keeps health value the same.

  const feedAnimals = () => {
    const feed = (type) => (animal) => {
      // Determine if the animal can be fed. Elephants can be fed even if "Cannot Walk".
      let canBeFed =
        isAliveCheck(type, animal.health) ||
        (type === "Elephant" && animal.status === "Cannot Walk");

      if (!canBeFed) {
        return animal; // If it cannot be fed, return the animal unchanged.
      }

      // Calculate new health, ensuring it does not exceed 100%.
      const newHealth = Math.min(
        100,
        animal.health + (getRandom(10, 25) * animal.health) / 100
      );

      // For elephants, check if the new health is above the threshold to change status back to "Alive".
      let newStatus = animal.status; // Default to current status
      if (type === "Elephant" && newHealth > 70) {
        newStatus = "Alive"; // Change status to "Alive" if health goes above 70%
      }

      // Return the updated animal object with new health and possibly updated status.
      return {
        ...animal,
        health: newHealth,
        status: newStatus, // This will be updated for elephants as necessary
      };
    };

    setAnimals({
      monkeys: animals.monkeys.map(feed("Monkey")),
      giraffes: animals.giraffes.map(feed("Giraffe")),
      elephants: animals.elephants.map(feed("Elephant")),
    });
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <div className="bg-white mx-40 rounded-[12px]">
        <h1 className="text-3xl font-bold text-center underline mb-6 py-6">
          Zoo Simulator
        </h1>
      </div>
      <div className="bg-white p-10 rounded-[12px] pt-10 ">
        <div className="flex justify-around mb-4">
          <button
            className="bg-blue-700 hover:bg-[#0E16AF] text-white font-bold py-3 px-4 rounded-[12px] shadow-lg"
            onClick={passTime}
          >
            Pass One Hour
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-[12px]"
            onClick={feedAnimals}
          >
            Feed Animals
          </button>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Time: {time} hours</h2>
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
    </div>
  );
};

export default Zoo;
