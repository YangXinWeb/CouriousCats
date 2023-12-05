    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";


    contract QuestionAnswerNFT is ERC721Enumerable {

        struct Question {
            string text;
            uint256 popularity;
            uint256[] answerIds;
        }

        struct Answer {
            string text;
            uint256 questionId;
        }

        mapping(uint256 => Question) public questions;
        mapping(uint256 => Answer) public answers;


        constructor() ERC721("QuestionAnswerNFT", "QANFT") {}

        function mintQuestion(string memory _question) public {
            require(bytes(_question).length <= 64, "Question is too long.");
            uint256 newQuestionId = totalSupply() + 1;
            questions[newQuestionId] = Question(_question, 0, new uint256[](0));
            _mint(msg.sender, newQuestionId);
        }

        function mintAnswer(uint256 _questionId, string memory _answer) public {
            // require(_exists(_questionId), "Question does not exist.");
            require(bytes(_answer).length <= 64, "Answer is too long.");
            require(_questionId <= totalSupply(), "Question does not exist.");
            uint256 newAnswerId = totalSupply() + 1;
            answers[newAnswerId] = Answer(_answer, _questionId);
            questions[_questionId].answerIds.push(newAnswerId);
            questions[_questionId].popularity += 1;
            _mint(msg.sender, newAnswerId);
        }

        function getQuestion(uint256 _questionId) public view returns (Question memory) {
            return questions[_questionId];
        }

        function getAnswersForQuestion(uint256 _questionId) public view returns (uint256[] memory) {
            return questions[_questionId].answerIds;
        }

        function getQuestionPopularity(uint256 _questionId) public view returns (uint256) {
            return questions[_questionId].popularity;
        }
    }
