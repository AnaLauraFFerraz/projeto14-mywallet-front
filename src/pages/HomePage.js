import React, { useState, useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import { UserContext } from "../context/UserContext"

export default function HomePage() {

  const { user, setUser, name } = useContext(UserContext)
  console.log(name)
  const token = user
  const [transactions, setTransactions] = useState([])
  const navigate = useNavigate()

  const BASE_URL = "https://mywallet-owev.onrender.com"

  useEffect(() => {
    async function listTransactions() {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      axios.get(`${BASE_URL}/home`, config)
        .then((res) => {
          setTransactions(res.data)
        })
        .catch((err) => {
          console.log("ERR ", err.response.data);
          navigate("/")
        })
    }
    listTransactions()
  }, [token, navigate])

  function handleLogout() {
    setUser({});
    localStorage.removeItem("token");
    navigate("/");
  }

  function handleTransactions() {
    if (transactions.length === 0) {
      return (
        <NoTransactions>Não há registros de<br />entrada ou saída</NoTransactions>
      )
    }

    function calcBalance() {
      let balance = 0
      transactions.map((t, index) => {
          const { value } = t

          balance += Number(value)
          return balance
        })
        return balance
    }
    const balance = calcBalance()

    function setBalanceType(balance) {
      let balanceType = ""

      if (balance > 0) {
        balanceType = "income";
      } else if (balance < 0) {
        balanceType = "expense";
      }
      return balanceType;
    }

    const balanceType = setBalanceType(balance)

    function compareDates(a, b) {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA > dateB) {
        return -1;
      } else if (dateA < dateB) {
        return 1;
      } else {
        return 0;
      }
    }

    return (
      <TransactionsContainer>
        <TransactionsList>
          <ul>
            {transactions
              .sort(compareDates)
              .map((t, index) => {
                const { value, description, date } = t

                let entryType = ""

                value > 0 ?
                  entryType = "income"
                  : entryType = "expense"

                return (

                  <ListItemContainer key={index}>
                    <div>
                      <span>{date}</span>
                      <strong> {description} </strong>
                    </div>
                    <Value color={entryType}> {value} </Value>
                  </ListItemContainer>
                )
              })}
          </ul>
        </TransactionsList>
        <article>
          <strong>Saldo</strong>
          <Value className={balanceType} color={balanceType}>
            {balance}
          </Value>
        </article>
      </TransactionsContainer>
    )
  }

  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {name}</h1>
        <BiExit onClick={handleLogout} />
      </Header>

      {handleTransactions()}

      <ButtonsContainer>
        <EntryButton to={`/nova-transacao/entrada`}>
          <AiOutlinePlusCircle />
          <p>Nova <br /> entrada</p>
        </EntryButton>
        <EntryButton to={`/nova-transacao/saida`}>
          <AiOutlineMinusCircle />
          <p>Nova <br />saída</p>
        </EntryButton>
      </ButtonsContainer>

    </HomeContainer>
  )
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
  min-height: 500px;
`
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`
const TransactionsContainer = styled.article`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  border-radius: 5px;
  padding: 16px;
  padding-bottom: 1rem;
  background-color: #FFFFFF;
  color: #000;
  article {
    display: flex;
    justify-content: space-between;   
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`
const TransactionsList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 1rem;

  ul {
    padding: 0;
    list-style-type: none;
  }
`
const NoTransactions = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 16px;
    border-radius: 5px;
    background: #FFFFFF;
    
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;
    text-align: center;
    color: #868686;
`
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;
  
  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "income" ? "green" : "red")};
  /* .income {
    color: green;
  }
  .expense {
    color: red;
  } */
`
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`
const EntryButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 114px;
  box-sizing: border-box;
  padding: 9px 9px;
  border: none;
  border-radius: 5px;
  background: #A328D6;

  font-weight: 700;
  font-size: 17px;
  line-height: 20px;
  color: #ffffff;
`;