import players
import numpy as np
import torch
import torch.nn.functional as F
from torch.utils.data import DataLoader, TensorDataset, random_split
import ANN

# torch.set_printoptions(threshold=torch.inf)

league = 1
season = 2022

normalize = 1

# Returns a dictionary of data for each game in a given league/season
# Dictionary in the format: {game_name: {'input': input_data, 'target': target_data}}
# input_data, target_data = players.get_pytorch_data(league, season)

input_data_2022 = torch.load(f"input_data_1_2022.pt")
target_data_2022 = torch.load(f"target_data_1_2022.pt")

input_data_2023 = torch.load(f"input_data_1_2023.pt")
target_data_2023 = torch.load(f"target_data_1_2023.pt")

input_data = torch.cat((input_data_2022, input_data_2023), dim=0)
target_data = torch.cat((target_data_2022, target_data_2023), dim=0)

# Save the data to a file
# torch.save(input_data, f"input_data_{league}_{season}.pt")
# torch.save(target_data, f"target_data_{league}_{season}.pt")

# print(f"Input data shape: {input_data.shape}")
# print(f"Input data: {input_data}")
# print(f"Target data shape: {target_data.shape}")
# print(f"Target data: {target_data}")

average_accuracy = 0
iterations = 10

for i in range(10):

    # Shuffle the data
    shuffle = torch.randperm(input_data.shape[0])
    input_data = input_data[shuffle]
    target_data = target_data[shuffle]

    # Normalize
    if normalize:
        input_data = F.normalize(input_data, p=2, dim=0)

    # Calculate training size
    train_size = int(0.8 * len(input_data))
    print(f"Train size: {train_size}")
    print(f"Validation size: {len(input_data) - train_size}")

    # Create Datasets
    training_set = TensorDataset(input_data[:train_size], target_data[:train_size])
    validation_set = TensorDataset(input_data[train_size:], target_data[train_size:])

    # Define batch size
    batch_size = 8

    # Create DataLoaders
    training_loader = DataLoader(training_set, batch_size=batch_size, shuffle=True)
    validation_loader = DataLoader(validation_set, batch_size=batch_size, shuffle=False)

    # Create the model
    input_size = input_data.shape[1]
    output_size = 1

    model = ANN.ANN(input_size, output_size, [128, 64, 32], ['relu', 'relu', 'relu'], dropout=False, dropout_rate=0.5)

    # Train the model
    model.train(training_loader, 100, 0.001)

    # Predict the output on testing data and print the percent correct
    correct = 0
    total = 0
    for inputs, targets in validation_loader:
        preds = model.predict(inputs)
        rounded_preds = torch.round(preds)
        
        correct += (rounded_preds == targets).sum().item()
        total += targets.size(0)
        
        for pred, target in zip(preds, targets):
            print(f"Prediction: {pred.item():.4f}, Actual: {target.item()}")

    accuracy = correct / total
    
    average_accuracy += accuracy

    print(f"Accuracy: {accuracy:.4f}")
    print(f"Correct: {correct}, Total: {total}")

print(f"Average accuracy: {average_accuracy / iterations:.4f}")