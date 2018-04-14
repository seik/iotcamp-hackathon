from ruuvitag_sensor.ruuvitag import RuuviTag
import threading
from time import gmtime, strftime
from web3 import Web3, HTTPProvider
from time import sleep
import os
import json

w3 = Web3(HTTPProvider("http://ropsten.dekaside.com:8545"))
w3.eth.enable_unaudited_features()

sensor = RuuviTag('D1:98:7E:8C:B4:5B')

sleep(10)

# def requestRuuvi():
# threading.Timer(3,requestRuuvi).start()

wallet_address = "0xCd21BC4dfD3566285496A53511bD6A8F0928e9AD"
contract_address = "0xdEECe13B65eceb66e1C1eaBA1B4B7a37A5843554"
private_key = "0xDF436EF6089C6D71A2E2FAB2E573B4B53829003E7161851AEFD7F8F1142C9E2F"

dir = os.path.abspath(os.path.dirname(__file__))
file_path = os.path.join(dir, 'build/contracts/Homnergy.json')

with open(file_path, encoding='utf-8') as json_file:
    build_json = json.loads(json_file.read())

for i in range(0, 10):
    # update state from the device
    state = sensor.update()
    
    # do some sleep so the ruuvi can send the data
    sleep(3)
    
    # get latest state (does not get it from the device)
    state = sensor.state

    confirmed_transactions = w3.eth.getTransactionCount(wallet_address)

    try:
        pending_transactions = len(w3.txpool.inspect.pending[wallet_address])
    except KeyError:
        pending_transactions = 0

    nonce = pending_transactions + confirmed_transactions

    contract_instance = w3.eth.contract(
        address=contract_address, abi=build_json['abi'])
    transaction = contract_instance.functions.publishTemperature(
        int(state['temperature'])).buildTransaction({'nonce': nonce})
    signed_txn = w3.eth.account.signTransaction(
        transaction, private_key)
    
    tx_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)
    
    print("Data sent with TxHash: " + w3.toHex(w3.sha3(signed_txn.rawTransaction)))

    sleep(10)

# requestRuuvi()
