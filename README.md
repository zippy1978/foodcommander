# foodcommander ![image](https://travis-ci.org/zippy1978/foodcommander.svg?branch=develop)
Food ordering tool.

## Installation

  npm install foodcommander -g


## Example : order pizzas at Domino's France with command lines

### First locate a store near you using your postal code

	$ foodcom store -p 34090
	
And get the matching stores:

	.-------------------------------------------------------------------------------------------------.
	|                                           Store list                                            |
	|-------------------------------------------------------------------------------------------------|
	|  id   |          name          |                    address                    |     phone      |
	|-------|------------------------|-----------------------------------------------|----------------|
	| 31966 | Montpellier Ouest      | 1 place Corot Montpellier 34070               | 04 67 700 200  |
	| 31889 | Montpellier Pompignane | 1651 avenue Pompignane Montpellier 34000      | 04 67 55 11 11 |
	| 31972 | Montpellier NORD       | 467 avenue du Major Flandre Montpellier 34090 | 04 67 70 04 04 |
	| 31663 | Montpellier Centre     | 19 quai des Tanneurs Montpellier 34000        | 04 67 79 26 20 |
	'-------------------------------------------------------------------------------------------------'
	
### Then have a look at the store menu
	
	$ foodcom menu -s 31972
	
And get available pizzas with prices and variants:

	.----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------.
	|                                                                                                                     Menu                                                                                                                     |
	|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
	|  id  |                name                 | type  |                                                                   description                                                                    |               variants               |
	|------|-------------------------------------|-------|--------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
	| PBAS | La Basquaise*                       | Pizza | SUPREME - Crème fraîche, mozzarella, oignons rouges, poivrons mélangés, poulet, sauce au piment du Pays Basque                                   | [size=med.] 12 € - [size=large] 15 € |
	| PPRO | La Provençale*                      | Pizza | SUPREME - Sauce Tomate, mozzarella, oignons rouges, poivrons mélangés, poulet, olives noires, romarin, basilic, thym                             | [size=med.] 12 € - [size=large] 15 € |
	| PMAR | Margherita*                         | Pizza | INCONTOURNABLE - Sauce tomate, mozzarella                                                                                                        | [size=med.] 11 € - [size=large] 14 € |
	| PMAE | Margherita Emmental*                | Pizza | INCONTOURNABLE - Sauce tomate, mozzarella, Emmental                                                                                              | [size=med.] 11 € - [size=large] 14 € |
	| PMAT | Margherita Tomates fraîches*        | Pizza | INCONTOURNABLE - Sauce tomate, mozzarella, tomates fraîches                                                                                      | [size=med.] 11 € - [size=large] 14 € |
	| PREI | La Reine                            | Pizza | INCONTOURNABLE - Sauce tomate, mozzarella, jambon, champignons                                                                                   | [size=med.] 11 € - [size=large] 14 € |
	| PPEP | Peppina*                            | Pizza | INCONTOURNABLE - Sauce tomate, mozzarella, oignons, champignons, poivrons mélangés, olives noires, tomates fraîches, origan                      | [size=med.] 11 € - [size=large] 14 € |
	| PORI | L'Orientale*                        | Pizza | INCONTOURNABLE - Sauce tomate, mozzarella, poivrons mélangés, oignons, merguez                                                                   | [size=med.] 11 € - [size=large] 14 € |
	| PAUS | L'Australienne*                     | Pizza | INCONTOURNABLE - Crème fraîche légère, sauce barbecue, mozzarella, oignons, champignons, boulettes de bœuf épicé                                 | [size=med.] 11 € - [size=large] 14 € |
	| PFOR | La Forestière                       | Pizza | SUPREME - Crème fraîche légère, mozzarella, lardons fumés, oignons, jambon, champignons, origan                                                  | [size=med.] 12 € - [size=large] 15 € |
	| PIND | L'Indienne*                         | Pizza | INCONTOURNABLE - Crème fraîche légère, mozzarella, oignons, poulet rôti, champignons, Emmental                                                   | [size=med.] 11 € - [size=large] 14 € |
	| PCAN | La Cannibale*                       | Pizza | SUPREME - Sauce barbecue, mozzarella, poulet rôti, boulettes de bœuf épicées, merguez                                                            | [size=med.] 12 € - [size=large] 15 € |
	| PCHI | Chickenita Pepperoni                | Pizza | SUPREME - Sauce tomate, mozzarella, poulet rôti, saucisson pepperoni, tomates fraîches, Emmental                                                 | [size=med.] 12 € - [size=large] 15 € |
	| PBCG | Bacon Groovy                        | Pizza | SUPREME - Crème fraîche légère, mozzarella, poulet rôti, oignons, bacon, sauce barbecue                                                          | [size=med.] 12 € - [size=large] 15 € |
	| PDSC | La Steak & Cheese*                  | Pizza | INCONTOURNABLE - Sauce tomate, mozzarella, boulettes de bœuf épicé, tomates fraîches, origan                                                     | [size=med.] 11 € - [size=large] 14 € |
	| PHYP | Hypnotika*                          | Pizza | INCONTOURNABLE - Sauce tomate, mozzarella, champignons, merguez, poulet rôti, crème fraîche légère                                               | [size=med.] 11 € - [size=large] 14 € |
	| PSAU | Saumonetä*                          | Pizza | SUPREME - Crème fraîche légère, mozzarella, oignons, pommes de terre, saumon fumé, aneth                                                         | [size=med.] 12 € - [size=large] 15 € |
	| PSVY | La Savoyarde                        | Pizza | SUPREME - Crème fraîche légère, mozzarella, lardons fumés, pommes de terre, Reblochon                                                            | [size=med.] 12 € - [size=large] 15 € |
	| P4FR | La 4 Fromages (base sauce tomate)*  | Pizza | SUPREME - Sauce tomate, mozzarella, chèvre, Emmental, Fourme d'Ambert                                                                            | [size=med.] 12 € - [size=large] 15 € |
	| P4FB | La 4 Fromages (base crème fraîche)* | Pizza | SUPREME - Crème fraîche légère, mozzarella, chèvre, Emmental, Fourme d'Ambert                                                                    | [size=med.] 12 € - [size=large] 15 € |
	| PEXT | Extravaganzza                       | Pizza | SUPREME - Sauce tomate, mozzarella, saucisson pepperoni, jambon, champignons, oignons, poivrons mélangés, boulettes de bœuf épicé, olives noires | [size=med.] 12 € - [size=large] 15 € |
	| PDES | La Composée*                        | Pizza | SUPREME - Base Margherita (tomate mozzarella), + 3 ingrédients au choix                                                                          | [size=med.] 12 € - [size=large] 15 € |
	'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------'

### Make your choice and order

	$ foodcom order -d PBAS[size=large]*2,P4FR --firstname Homer --lastname Simpson --email homer.simpson@somewhere.com --street "evergreen terrace" --streetnumber 74 --phone 0999555555 -p 34090 -c montpellier -s 31972
	
Then you just have to wait...

## Command line usage

### Franchises

At the time the only supported franchise is Domino's Pizza France but it is easy to implement a new franchise (any contribution is welcomed !).

To look at available franchises:

	$ foodcom franchise
	
	.------------------------------------.
	|           Franchise list           |
	|------------------------------------|
	|     id     |         name          |
	|------------|-----------------------|
	| dominos_fr | Domino's Pizza France |
	'------------------------------------'
	
The first franchise of the list is the default.

To change the franchise use the *-f* switch with any command.

Command line help:

	$ foodcom franchise --help
	
	  Usage: foodcom-franchise [options]
	
	  interact with franchises
	
	  Options:
	
	    -h, --help     output usage information
	    -V, --version  output the version number
	    
### Store

Use the *store* subcommand to find stores arround you.

	$ foodcom store -p 34000
	
Command line help:

	$ foodcom store --help
	
	  Usage: foodcom-store [options]
	
	  interact with stores
	
	  Options:
	
	    -h, --help                     output usage information
	    -V, --version                  output the version number
	    -f, --franchise [franchise]    franchise
	    -p, --postalcode [postalcode]  postal code
	    
### Menu

List store dishes and prices.

	$ foodcom menu -s 31889
	
Command line help:

	$ foodcom menu --help
	
	  Usage: foodcom-menu [options]
	
	  query menus
	
	  Options:
	
	    -h, --help                   output usage information
	    -V, --version                output the version number
	    -f, --franchise [franchise]  franchise
	    -s, --store [store]          store
	    
### Order

Place an order.

	$ foodcom order -d PBAS[size=large]*2,P4FR --firstname Homer --lastname Simpson --email homer.simpson@somewhere.com --street "evergreen terrace" --streetnumber 74 --phone 0999555555 -p 34090 -c montpellier -s 31972

Command line help:

	$ foodcom order --help
	
	  Usage: foodcom-order [options]
	
	  place an order
	
	  Options:
	
	    -h, --help                     output usage information
	    -V, --version                  output the version number
	    -b, --batch                    batch mode (no user interaction required)
	    -v, --verbose                  outputs debug info
	    -f, --franchise [franchise]    franchise
	    -s, --store [store]            store
	    -d, --dishes [dishes]          dishes, example: -d REF1[size=large]*4,REF2[size=medium]*2
	    --firstname [firstname]        first name
	    --lastname [lastname]          last name
	    --email [email]                email address
	    --phone [phone]                phone number
	    --intercom [intercom]          intercom number
	    --building [building]          building name
	    --floor [floor]                floor
	    --streetnumber [streetnumber]  street number, use a dash for bis or ter, like this : 23-bis
	    --street [street]              street name
	    -p, --postalcode [postalcode]  postal code
	    -c, --city [city]              city
	    --comment [comment]            comment
	    --dryrun                       if set , order will not be sent at the end of the process. Useful for testing purpose

## Release Notes

### 0.0.2
 * bug fixes
 * removed unused dependencies

### 0.0.1
 * Initial version