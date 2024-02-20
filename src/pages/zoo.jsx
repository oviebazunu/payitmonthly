import React, { useState } from "react";

// Helper function to generate a random number within a range
const getRandom = (min, max) => Math.random() * (max - min) + min;

const Animal = ({ type, health }) => {
  let isAlive = true;
  if (type === "Elephant" && health < 70) isAlive = false;
  if (type === "Monkey" && health < 30) isAlive = false;
  if (type === "Giraffe" && health < 50) isAlive = false;

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">{type}</h2>
      <p>Health: {health.toFixed(2)}%</p>
      <p>
        Status:{" "}
        <span
          className={`font-semibold ${
            isAlive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isAlive ? "Alive" : "Dead"}
        </span>
      </p>
    </div>
  );
};

const Zoo = () => {
  const initialAnimals = {
    monkeys: new Array(5).fill(100),
    giraffes: new Array(5).fill(100),
    elephants: new Array(5).fill(100),
  };

  const [animals, setAnimals] = useState(initialAnimals);
  const [time, setTime] = useState(0);

  const animalNames = {
    monkeys: "Monkey",
    giraffes: "Giraffe",
    elephants: "Elephant",
  };

  const passTime = () => {
    setTime(time + 1);
    const updateHealth = (health) =>
      Math.max(0, health - (getRandom(0, 20) * health) / 100);
    setAnimals({
      monkeys: animals.monkeys.map(updateHealth),
      giraffes: animals.giraffes.map(updateHealth),
      elephants: animals.elephants.map(updateHealth),
    });
  };

  const feedAnimals = () => {
    const feed = (health) =>
      Math.min(100, health + (getRandom(10, 25) * health) / 100);
    setAnimals({
      monkeys: animals.monkeys.map(feed),
      giraffes: animals.giraffes.map(feed),
      elephants: animals.elephants.map(feed),
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
        {Object.entries(animals).map(([type, healths], index) => (
          <div key={index}>
            <h2 className="text-xl font-bold capitalize mb-2 underline underline-offset-2 decoration-2">
              {type}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8 capitalize">
              {healths.map((health, index) => (
                <Animal key={index} type={animalNames[type]} health={health} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Zoo;
