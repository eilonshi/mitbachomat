import RPi.GPIO as GPIO
import time
#################
### constants ###
#################

is_BCM = True  # GPIO numbering - True for GPIO.BCM, False for GPIO.BOARD
button_numbers = {  # dictionary with all GPIO numbers (BCM / BOARD)
    5: "Green Button", 7: "White Button", 11: "Grey Button", 13: "Yellow Button"
}
buff = 0.05  # buffer time between inputs (in seconds)

#################

if is_BCM:
    GPIO.setmode(GPIO.BCM)
else:
    GPIO.setmode(GPIO.BOARD)

for button in button_numbers:
    GPIO.setup(button, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)


def trigger_button(button_num):
    print("{name} was pressed".format(name=button_numbers[button_num]))
    '''
    if button_num == #???#:
        #...#
    elif button_num == #???#:
        #...#
    else:
        #...default...#
    '''

prev_input = {button_num : False for button_num in button_numbers}
curr_input = {button_num : False for button_num in button_numbers}
while True:
    for button_num in prev_input:
        prev_input[button_num] = curr_input[button_num]
        curr_input[button_num] = GPIO.input(button_num)
    for button_num in prev_input:
        if (not prev_input[button_num]) and curr_input[button_num]:
            trigger_button(button_num)
    time.sleep(buff)


