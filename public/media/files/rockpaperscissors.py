ScoreOne = int(0)
ScoreTwo = int(0)
GameTally = int(0)


def EvaluateInput(one, two):
    if one == "rock":
        if two == "scissor":
            print("Player One wins")
            ScoreOne += 1
            GameTally += 1
        elif two == "rock":
            print("Draw")
            GameTally += 1
        elif two == "paper":
            print("Player Two wins")
            ScoreTwo += 1
            GameTally += 1
    elif one == "scissor":
        if two == "scissor":
            print("Draw")
            GameTally += 1
        elif two == "rock":
            print("Player Two wins")
            ScoreTwo += 1
            GameTally += 1
        elif two == "paper":
            print("Player One wins")
            ScoreOne += 1
            GameTally += 1
    elif one == "paper":
        if two == "scissor":
            print("Player Two wins")
            ScoreTwo += 1
            GameTally += 1
        elif two == "rock":
            print("Player One wins")
            ScoreOne += 1
            GameTally += 1
        elif two == "paper":
            print("Draw")
            GameTally += 1

    else:
        print("Wrong input, Player One!")


while GameTally < 5:
    PlayerOne = input(f'Select your hand, PlayerOne ').lower()
    PlayerTwo = input(f'Select your hand, PlayerTwo ').lower()

    print("Input Received:",PlayerOne, "against", PlayerTwo)

    EvaluateInput(PlayerOne, PlayerTwo)