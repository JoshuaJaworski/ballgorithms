import React, { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SearchModels() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeModelName, setActiveModelName] = useState("");
  const [activeModelType, setActiveModelType] = useState("");
  const [activeModelVis, setActiveModelVis] = useState("");
  const [activeTrainingData, setActiveTrainingData] = useState({});
  const [activeValidationData, setActiveValidationData] = useState({});

  const handleSearch = async () => {
    if (searchQuery.length !== 0) {
      try {
        const response = await axios.get("http://localhost:3000/search", {
          params: { q: searchQuery },
        });
        if (response.data.length > 0) {
          setSearchResults(response.data);
          console.log(searchQuery);
          setActiveModelName(response.data[0].model_name);
          setActiveModelType(response.data[0].model_type);
          //setActiveModelVis(response.data[0].model_vis);

          //console.log(response.data[0].training_loss)
          //console.log(response.data[0].training_accuracy)
          /* Set training loss data */
          const training_data = {
            labels: Array.from(Array(100).keys()),
            datasets: [
              {
                label: "Training Loss",
                data: response.data[0].training_loss,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
              {
                label: "Training Accuracy",
                data: response.data[0].training_accuracy,
                borderColor: "rgb(0, 204, 102)",
                backgroundColor: "rgba(0, 204, 102, 0.5)",
              },
            ],
          };

          /* Set validation loss data */
          const validation_data = {
            labels: Array.from(Array(100).keys()),
            datasets: [
              {
                label: "Validation Loss",
                data: response.data[0].validation_loss,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
              {
                label: "Validation Accuracy",
                data: response.data[0].validation_accuracy,
                borderColor: "rgb(0, 204, 102)",
                backgroundColor: "rgba(0, 204, 102, 0.5)",
              },
            ],
          };

          setActiveTrainingData(training_data);
          setActiveValidationData(validation_data);
        } else {
          setSearchResults([]);
        }

        console.log(response.data);
      } catch (error) {
        console.error(error);
        setSearchResults([]);
      }
    }
  };

  let info = () => {
    if (searchResults.length === 0) {
      return <p>No Models Were Found</p>;
    }
    return searchResults.map((element, index) => {
      return (
        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {element.model_name}
          </th>
          <td class="px-6 py-4">{element.model_type}</td>
          <td class="px-6 py-4">{element.validation_accuracy[99]}</td>
          <td class="px-6 py-4">
            <a
              href="#"
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              View
            </a>
          </td>
        </tr>
      );
    });
  };

  return (
    <div class="min-h-screen bg-bg-grey">
    <div class="bg-contain bg-bg-grey">
      <div class="max-w-md mx-auto ">
        <label
          for="default-search"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div class="relative ">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="default-search"
            class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Models"
            required
          />
          <button
            onClick={handleSearch}
            class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </div>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg ">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Model name
              </th>
              <th scope="col" class="px-6 py-3">
                Model Type
              </th>
              <th scope="col" class="px-6 py-3">
                Accuracy
              </th>
              <th scope="col" class="px-6 py-3">
                View Model
              </th>
            </tr>
          </thead>
          <tbody>{info()}</tbody>
        </table>
      </div>
    </div>
    <div class="h-full bg-bg-grey">
    </div>
    </div>

  );
}

export default SearchModels;
