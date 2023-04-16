import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';

import CustomComponentListLoader from '../../customComponentListLoader';

import styles from './styles';

const CustomTableView = ({ tableData }) => {
  const [componentName, setComponentName] = useState([]);
  const [componentPrimerCoat, setComponentPrimerCoat] = useState([]);
  const [componentIntermediate, setComponentIntermediate] = useState([]);
  const [componentFinalCoat, setComponentFinalCoat] = useState([]);
  const [componentPrimer1, setComponentPrimer1] = useState([]);
  const [componentIntumescent, setComponentIntumescent] = useState([]);
  const [componentPrimer2, setComponentPrimer2] = useState([]);
  const [componentTopCoat, setComponentTopCoat] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    setIsloading(true);
    if (tableData && tableData.length > 0) {
      const componentNameData = [], componentPrimerCoatData = [], componentIntermediateData = [], componentFinalCoatData = [];

      tableData.forEach((data) => {
        componentNameData.push(data.name);
        componentPrimerCoatData.push(data.primerCoat);
        componentIntermediateData.push(data.intermediate);
        componentFinalCoatData.push(data.finalCoat);
      })
      setComponentName(componentNameData);
      setComponentPrimerCoat(componentPrimerCoatData);
      setComponentIntermediate(componentIntermediateData);
      setComponentFinalCoat(componentFinalCoatData);
      setIsloading(false)
    }
  }, [tableData])

  const nameComponent = componentName.map((name, index) => {
    return (
      <Row key={index} style={styles.dataRow}><Text>{name}</Text></Row>
    )
  })

  const primerCoatComponent = componentPrimerCoat.map((primerCoat, index) => {
    return (
      <Row key={index} style={[styles.dataRow, styles.dataAlign]}><Text>{primerCoat}%</Text></Row>
    )
  })

  const intermediateComponent = componentIntermediate.map((intermediate, index) => {
    return (
      <Row key={index} style={[styles.dataRow, styles.dataAlign]}><Text>{intermediate}%</Text></Row>
    )
  })

  const finalCoatComponent = componentFinalCoat.map((finalCoat, index) => {
    return (
      <Row key={index} style={[styles.dataRow, styles.dataAlign]}><Text>{finalCoat}%</Text></Row>
    )
  }) 

  const DataComponent = () => {
    return (
      <ScrollView horizontal contentContainerStyle={styles.container}>
        <Grid style={styles.table}>
          <Col>
            <Row style={[styles.headRow]}><Text style={styles.headTextStyle}>Name</Text></Row>
            {nameComponent}
          </Col>
          <Col>
            <Row style={[styles.headRow]}><Text style={styles.headTextStyle}>Primer Coat</Text></Row>
            {primerCoatComponent}
          </Col>
          <Col>
            <Row style={styles.headRow}><Text style={styles.headTextStyle}>Intermediate</Text></Row>
            {intermediateComponent}
          </Col>
          <Col>
            <Row style={styles.headRow}><Text style={styles.headTextStyle}>Final Coat</Text></Row>
            {finalCoatComponent}
          </Col>
        </Grid>
      </ScrollView>
    )
  }

  if (isLoading) {
    return <CustomComponentListLoader/>
  } else {
    return (
      <View>
        <DataComponent/>
      </View>
    )
  }
}

export default CustomTableView;