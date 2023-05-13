// import { ListItem } from '@rneui/themed';
import { View, Text, Pressable, Image, TouchableWithoutFeedback } from "react-native";
import styles from './styles';
import moment from 'moment';

const CustomZoneView = ({ data, onLongPress, isEvent, isPIC, onDownload }) => {

  const downloadDocument = (url, docName) => {
    onDownload(url, docName);
  }

  const initial = (details) => {
    const info = details.slice(0, 1);
    return info.toUpperCase();
  }

  const ZoneView = () => data.map((details, indexRow) => {
    return (
      <View key={details.id}>
        <Pressable onLongPress={() => onLongPress(indexRow)}>
          <View style={styles.container}>
            {isEvent &&
              <View style={data.length === (indexRow + 1) ? styles.stylingLast : styles.styling}>
                <View>
                  <View style={styles.header}>
                    {details?.imageDownloadURL &&
                      <View style={{ width: '100%', height: 150, borderBottomWidth: 1, borderBottomColor: '#808080', marginBottom: 5 }}>
                        <Image source={{ uri: details.imageDownloadURL }} style={{ width: '100%', height: 150 }}></Image>
                      </View>
                    }
                    {!details?.imageDownloadURL && <View style={{ width: '100%', height: 150, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}><Text>No image selected</Text></View>}
                    <>
                      {details?.description &&
                        <View style={{ marginBottom: 5 }}>
                          <Text>{details?.description}</Text>
                        </View>
                      }
                      <View style={{ marginBottom: 20 }}>
                        <Text>{details?.dateTime ? moment(details.dateTime).format('DD MMM YYYY') : ''}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                          <Text>Uploaded by: {details?.uploader?.name}</Text>
                        </View>
                        {details?.documentDownloadURL &&
                          <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#570861', backgroundColor: '#570861' }}>
                            <TouchableWithoutFeedback onPress={() => downloadDocument(details.documentDownloadURL, details.documentNameRef)}>
                              <View>
                                <Text style={{ color: 'white', paddingHorizontal: 4, paddingVertical: 2 }}>Download Document</Text>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        }
                      </View>
                    </>
                  </View>
                </View>
              </View>
            }
            {isPIC &&
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 7, paddingHorizontal: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#D3D3D3' }}>
                <View style={{ width: 60, justifyContent: 'center' }}>
                  <View style={{ width: 45, height: 45 }}>
                    {details?.imageDownloadURL &&
                      <Image source={{ uri: details.imageDownloadURL }} style={{ width: 45, height: 45, borderRadius: 50 }}></Image>
                    }
                    {!details?.imageDownloadURL &&
                      <View style={{ justifyContent: 'center', backgroundColor: 'grey', height: '100%', borderRadius: 50 }}>
                        <Text style={{ textAlign: 'center', fontSize: 20 }}>{initial(details.picName)}</Text>
                      </View>
                    }
                  </View>
                </View>
                <View style={{ justifyContent: 'center', flexDirection: 'column' }}>
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontSize: 15, fontWeight: 600 }}>{details?.picName}</Text>
                  </View>
                  {details?.picName &&
                    <View style={{ marginBottom: 20 }}>
                      <Text style={{ fontSize: 12, fontWeight: 500 }}>{details?.description}</Text>
                    </View>
                  }
                  {details?.documentDownloadURL &&
                    <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#D3D3D3', backgroundColor: '#570861' }}>
                      <TouchableWithoutFeedback onPress={() => downloadDocument(details.documentDownloadURL, details.documentNameRef)}>
                        <View>
                          <Text style={{ color: 'white', paddingHorizontal: 4, paddingVertical: 2 }}>Download Document</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  }
                </View>
              </View>
            }
          </View>
        </Pressable>
      </View>
    )
  })

  return (
    <>
      <ZoneView />
    </>
  )
}

export default CustomZoneView;