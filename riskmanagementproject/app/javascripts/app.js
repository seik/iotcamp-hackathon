// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3 } from "web3";
import { default as contract } from "truffle-contract";

import contract_artifacts from "../../build/contracts/MainContract.json";

const MainContract = contract(contract_artifacts);

const contractInstance = MainContract.at(
  "0x7f157cb2b1a0e297212468dce0ae4dfc4f2cc7e3"
);

window.App = {
  start: async function() {
    MainContract.setProvider(web3.currentProvider);
    MainContract.defaults({ from: web3.eth.coinbase });

    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("there was an error fetching your accoutns.");
        return;
      }
      if (accs.length == 0) {
        alert("No accounts");
        return;
      }
    });

    //this.loadPosts();
  },

  loadPost: async function() {
    const hashSearch = document.getElementById("hash-search").value;

    const result = await contractInstance.getData(hashSearch);

    const dataObject = {
      startTimestamp: result[0],
      endTimestamp: result[1],
      timeframe: result[2]
    };

    this.showPost(dataObject);
  },

  publishPost: async function() {
    const startTimestampContent = document.getElementById(
      "start-timestamp-content"
    ).value;
    const endTimestampContent = document.getElementById("end-timestamp-content")
      .value;
    const timeframeContent = document.getElementById("timeframe-content").value;
    const hashContent = document.getElementById("hash-content").value;

    if (
      startTimestampContent.trim() &&
      endTimestampContent.trim() &&
      timeframeContent.trim() &&
      hashContent.trim()
    ) {
      await contractInstance.addData(
        startTimestampContent,
        endTimestampContent,
        timeframeContent,
        hashContent
      );
    }
  },

  showPost: async function(postElement) {
    let templatePost = document.querySelector("#post");

    let clone = document.importNode(templatePost, true);

    clone.content.querySelector("#start-timestamp").textContent =
      postElement.startTimestamp;
    clone.content.querySelector("#end-timestamp").textContent =
      postElement.endTimestamp;
    clone.content.querySelector("#timeframe").textContent =
      postElement.timeframe;

    const posts = document.getElementById("posts");
    posts.insertBefore(clone.content, posts.childNodes[0]);
  }
};

window.addEventListener("load", function() {
  if (typeof web3 !== "undefined") {
    console.warn(
      "Using web3 detected from external source. If you find that your accounts don't appear, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask"
    );
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn(
      "No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask"
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    );
  }

  App.start();
});
