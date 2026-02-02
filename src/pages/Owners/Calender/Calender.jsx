import React from 'react'
import Header from '../Components/Header/Header'
import './Calender.css'
import PageTitle from '../Components/PageTitle'
import { Container } from '../../LandingPage/LandingPage'

import DateCalendarServerRequest from './DatePickerComponent'
Container
function Calender() {
  return (
    <div className='calender'>
     <Header/>
     <Container>
        <PageTitle
     title="Availability Calender"
     subTitle="Manage your schedule , view appointments and block dates "
     buttonText={"Add New Event"}
     >

     </PageTitle>
     <DateCalendarServerRequest />
     </Container>
   

    </div>
  )
}

export default Calender