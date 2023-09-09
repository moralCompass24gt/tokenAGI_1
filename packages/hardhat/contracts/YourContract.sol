// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract YourContract is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    //设置NFT最大数量
    uint256 MAX_SUPPLY = 1000;

    //记录每个nftId对应的地址
    mapping (uint256 => address) private tokenId2Add;

    constructor() ERC721("TokenagiAccessGated", "TAG") {}

    function safeMint(address to) public {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId <= MAX_SUPPLY,"I'm sorry we reach the cap. Pls contact us to get access!!");
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        tokenId2Add[tokenId]=to;
    }

    function isExist(address _add) public view returns(bool){

        //_add不能是空地址
        require(_add != address(0), "NFT owner can not be address(0)");

        uint256 curId = _tokenIdCounter.current();

        //遍历数组查找该地址是否持有nft
        for(uint i=0;i<curId;i++){
            if(tokenId2Add[i]==_add)
            return true;
        }

        return false;

    }

}