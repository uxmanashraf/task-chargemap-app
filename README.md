# chargemapapp

Chargemapapp is a simple UI for searching and presenting charging stations in a map view.

## Preface

E-mobility charging stations are spread around the world and users want to find charging stations that fit their car configurations.
A charging station can have 1 or more connectors (or plugs) that have different connector types (i.e. Type 2, CHAdeMO, CCS).

The objective of this little product is to lookup charging stations that are in a specific distance to the user and serve the connector type that the user's car requires and to present it in a map view with some additional information.

## Objectives

### Data provider

The API at https://openchargemap.org/site/develop/api should be used to search for charging stations. No additional data should be used in this project.

The API provides data in a very noisy data model. We assume a application side data model entity with the name `chargingStation`. The following mapping should be applied:

| Description                | API model path                                | App model path                             | type   |
| -------------------------  | --------------------------------------------- | ------------------------------------------ | ------ |
| address street and number  | addressInfo.addressLine1                      | chargingStation.address.street             | string |
| address zip                | addressInfo.postcode                          | chargingStation.address.zip                | string |
| address town               | addressInfo.town                              | chargingStation.address.town               | string |
| address country            | addressInfo.country.isoCode                   | chargingStation.address.countryCode        | string |
| geo location lat           | addressInfo.latitude                          | chargingStation.location.lat               | number |
| geo location lon           | addressInfo.longitude                         | chargingStation.location.lon               | number |
| operator name              | operatorInfo.title                            | chargingStation.operatorName               | string |
| pricing info               | usageCost                                     | chargingStation.priceInfo                  | string |
| connectors array           | connections                                   | chargingStation.connectors                 | array  |
| connector number           | connections.N.connectionType.id               | chargingStation.connectors.N.number        | string |
| connector plug type        | connections.N.connectionType.title            | chargingStation.connectors.N.type          | string |
| connector max power        | connections.N.powerKW                         | chargingStation.connectors.N.maxPowerInKW  | string |
| status available           | statusType.isUserSelectable                   | chargingStation.available                  | bool   |

### Visual appearance

You're absolutely free to design the visual aspects of the application. Let this wireframe inspire you: [wireframe](base.png).

The app consists of a filter form, a map view and a detail view.

The filter form contains:

* a free text field that can be used set the _maximum distance_ of the charging stations from the users current position. 
* a group of checkboxes that can be used to additionally filter the displayed charging stations by the connector types. Values are:
  * Type 2: value = 25
  * CHAdeMO: value = 2
  * CCS: value = 33

The default and initial value for the _maximum distance_ field should be set to 100km.
All checkboxes are initially un-checked and the query should take all values into account. Other connector types than the mentioned three should not be retrieved.

The results will be presented as map markers in the map view. The color of the marker depends on the current status of the charging station (represented by `chargingStation.connectors.N.available`):

* green = available
* red = anything else then available

**Bonus:** The markers should be grouped (clustered) to improve UX.

When the user clicks on a marker, a detail view (pop-up) opens up and displays some additional info of the charging station, as shown in the picture.

The pop-up shows the following content, mapped to the following data model attributes:

| Name in pop up | model attribute (calculated value)                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| Street         | chargingStation.address.street                                                                                      |
| Zip            | chargingStation.address.zip                                                                                         |
| Town           | chargingStation.address.town                                                                                        |
| Country        | chargingStation.address.countryCode                                                                                 |
| Latitude       | chargingStation.location.lat                                                                                        |
| Longitude      | chargingStation.location.lon                                                                                        |
| Operator corp. | chargingStation.operatorName                                                                                        |
| Distance       | not in model, should be calculated from user's current location to the geo point of the charging station (lat, lon) |
| Status         | chargingStation.available (true = "Available", false = "Occupied")                                                  |
| #              | chargingStation.connectors.N.number                                                                                 |
| plug type      | chargingStation.connectors.N.type                                                                                   |
| max power      | chargingStation.connectors.N.maxPowerInKW                                                                           |
| Pricing info   | chargingStation.priceInfo                                                                                           |

The initial view of the map has the users current position and a zoom factor that is adjusted by the _maximum distance_.
The map content should be reloaded whenever the user enters another value for _maximum distance_ or changes the state of the checkboxes.

### Example API requests

#### Retrieve all charging stations in 50km radius of a location in Rotterdam for all 3 connector types

https://api.openchargemap.io/v3/poi/?output=json&camelcase=true&distance=50&distanceunit=KM&connectiontypeid=25,2,33&latitude=51.905445&longitude=4.466637

#### Retrieve all charging stations in 50km radius of a location in Rotterdam for connector type "Type 2"

https://api.openchargemap.io/v3/poi/?output=json&camelcase=true&distance=50&distanceunit=KM&connectiontypeid=25&latitude=51.905445&longitude=4.466637

### Technology

The application should be set-up out as a Single Page Application (SPA) that is based on a technology of your choice. Possible technologies (but not limited to) are:

* Angular
* React
* Vue.js
* Meteor

It's your project; you name it. It is fine, if you don't want to use a framework. 
Please use typescript and according transpilation.

### Target architecture

1. Use a service layer that contains services that talk to the API and deliver the data asynchronously to the requesting part of the application.
2. All data models that are used in the application should be defined in a model layer. Services produce model objects and components consume them.
3. Use components to encapsulate dedicated functionality and views.

### Tests

Choose some units that you would like add unit test for. Use a framework you are familiar with.
If you have a lean approach for e2e test you can of course apply it to your project. 

## Deliverables

Either:

* A buildable source code project, packaged as zip.
* A git repository, for instance a fork of this repository with the source code of your application. 

**Bonus:** Provide a simple docker image that a webserver (i.e. nginx) to host the web application.
