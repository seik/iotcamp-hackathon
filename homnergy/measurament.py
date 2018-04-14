import os
import json

from ruuvitag_sensor.ruuvitag import RuuviTag
from time import gmtime, strftime, sleep
from web3 import Web3, HTTPProvider

import threading


# D31FACAA0C9E
sensor = RuuviTag('D3:C9:4A:EB:77:D2')

temp = []
pres = []
acc = []
time = []

# def requestRuuvi():
# threading.Timer(3,requestRuuvi).start()

address = "0xdeece13b65eceb66e1c1eaba1b4b7a37a5843554"
private_key = "0xDF436EF6089C6D71A2E2FAB2E573B4B53829003E7161851AEFD7F8F1142C9E2F"

script_dir = os.path.dirname(__file__)
file_path = os.path.join(script_dir, './build/Homnergy.json')

with open(file_path, encoding='utf-8') as json_file:
    build_json = json.loads(json_file.read())

w3 = Web3(HTTPProvider("http://ropsten.dekaside.com:8545"))

for i in range(0, 10):
    # update state from the device
    state = sensor.update()

    # get latest state (does not get it from the device)
    state = sensor.state
    time.append(strftime("%Y-%m-%d %H:%M:%S", gmtime()))
    temp.append(state['temperature'])
    pres.append(state['pressure'])
    acc.append(state['acceleration'])

    print(strftime("%Y-%m-%d %H:%M:%S", gmtime()))
    print(state['temperature'])
    print(state['pressure'])
    print(state['acceleration'])

    confirmed_transactions = w3.eth.getTransactionCount(address)

    try:
        pending_transactions = len(w3.txpool.inspect.pending[address])
    except KeyError:
        pending_transactions = 0

    nonce = pending_transactions + confirmed_transactions

    contract_instance = w3.eth.contract(
        address=address, abi=build_json['abi'])
    transaction = contract_instance.functions.publishTemperature(
        state['temperature']).buildTransaction({'nonce': nonce})
    signed_txn = w3.eth.account.signTransaction(
        transaction, private_key)

    sleep(10)


print("Average temperature: "+str(sum(temp)/float(len(temp)))+"ºC")
print("Average pressure: "+str(sum(pres)/float(len(pres)))+" mbar")
print("Average acceleration: "+str(sum(acc)/float(len(acc)))+" ?")

# requestRuuvi()
