import React from 'react'
import { useParams } from 'react-router-dom';
import { Container, Head } from '../LandingPage/LandingPage';
Head
Container
function PropertyDetails() {
    const { propertyId } = useParams();
  return (
    <div>
    <Head/>
    <Container>
        Property Details for {propertyId}
    </Container>

    </div>
  )
}

export default PropertyDetails