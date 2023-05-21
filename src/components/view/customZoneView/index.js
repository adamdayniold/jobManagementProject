// import { ListItem } from '@rneui/themed';
import { View, Text, Pressable, Image, TouchableWithoutFeedback, Alert } from "react-native";
import styles from './styles';
import moment from 'moment';

import { db } from "../../../../firebase";
import { updateDoc, doc } from "firebase/firestore";

import CustomInput from "../../customInput";
import CustomBottomDrawer from "../../customBottomDrawer";
import { useState } from "react";

const CustomZoneView = ({ data, onLongPress, isEvent, isPIC, onDownload, onSubmitComment, userData }) => {

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const downloadDocument = (url, docName) => {
    onDownload(url, docName);
  }

  const openSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  }

  const initial = (details) => {
    const info = details.slice(0, 1);
    return info.toUpperCase();
  }

  const submitComment = async (indexRow, commentValue) => {
    const comntVal = commentValue.trim();
    if (comntVal === "") {
      openSheet();
      alertPopup('Warning', 'Cannot submit empty comment');
      return;
    }
    const dataRow = JSON.parse(JSON.stringify(data[indexRow]));
    dataRow.comments.push({ commentDetails: commentValue, commentedBy: userData });
    openSheet();
    onSubmitComment(dataRow);
  }

  const alertPopup = (title, message) => Alert.alert(title, message, [{
    text: 'OK',
    onPress: () => console.log('OK Pressed')
  }]);

  const ZoneView = () => data.map((details, indexRow) => {
    return (
      <View key={details.id}>
        <Pressable onLongPress={() => onLongPress(indexRow)}>
          <View style={styles.container}>
            {isEvent &&
              <>
                <View style={data.length === (indexRow + 1) ? styles.stylingLast : styles.styling}>
                  <View>
                    <View style={styles.header}>
                      {details?.imageDownloadURL &&
                        <View style={{ width: '100%', height: 150, borderBottomWidth: 1, borderBottomColor: '#808080', marginBottom: 5 }}>
                          <Image source={{ uri: details.imageDownloadURL }} style={{ width: '100%', height: 150 }}></Image>
                        </View>
                      }
                      {!details?.imageDownloadURL && <View style={{ backgroundColor: '#d3d3d3', width: '100%', height: 150, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}><Text>No image</Text></View>}
                      <>
                        {details?.description &&
                          <View style={{ marginBottom: 5 }}>
                            <Text>{details?.description}</Text>
                          </View>
                        }
                        <View style={{ marginBottom: 20 }}>
                          <Text>{details?.dateTime ? moment(details.dateTime).format('DD MMM YYYY') : ''}</Text>
                        </View>
                        <View style={details?.comments && details?.comments.length > 0 ? styles.uploadedSectionWith : styles.uploadeSectionWithout}>
                          <View>
                            <Text>Uploaded by: {details?.uploader?.name}</Text>
                          </View>
                          {/* {details?.documentDownloadURL && */}
                          <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#570861', backgroundColor: '#570861' }}>
                            <TouchableWithoutFeedback onPress={() => downloadDocument(details.documentDownloadURL, details.documentNameRef)}>
                              <View>
                                <Text style={{ color: 'white', paddingHorizontal: 4, paddingVertical: 2 }}>Download Document</Text>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                          {/* } */}
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                          {details?.comments && details?.comments.length > 0 &&
                            details?.comments.map((commentData, index) => {
                              return (
                                <View key={index} style={{ borderWidth: 1, borderColor: '#faf6f8', backgroundColor: '#faf6f8', padding: 5, borderRadius: 10, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
                                  <View style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 50, width: 30, height: 30, marginRight: 10 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 20 }}>{initial(commentData.commentedBy.name)}</Text>
                                  </View>
                                  <View>
                                    <Text style={{ fontWeight: 500 }}>{commentData.commentedBy.name}</Text>
                                    <Text>{commentData.commentDetails}</Text>
                                  </View>
                                </View>
                              )
                            })
                          }
                          {!details?.archived &&
                            <View style={{ marginTop: 10, borderWidth: 1, borderRadius: 5, borderColor: '#570861', backgroundColor: '#570861' }}>
                              <TouchableWithoutFeedback onPress={() => openSheet(true)}>
                                <View>
                                  <Text style={{ textAlign: 'center', color: 'white', padding: 4 }}>Add comment</Text>
                                </View>
                              </TouchableWithoutFeedback>
                            </View>
                          }
                        </View>
                      </>
                    </View>
                  </View>
                </View>
                <CustomBottomDrawer
                  drawerCondition={isBottomSheetOpen}
                  closeDrawer={openSheet}
                  onSubmit={(value) => submitComment(indexRow, value)}
                />
              </>
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