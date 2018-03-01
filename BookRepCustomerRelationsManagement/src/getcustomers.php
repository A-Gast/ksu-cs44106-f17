<?php
	function get_customers( $customer_id = null ) {
		$customers = array();
		$index = 0;
		$handle = fopen("../data/customers.txt", "r");
		if ($handle) {

			while (($customers[$index] = fgets($handle)) !== false) {
			  $index++;
			}
			fclose($handle);

		} else {
		echo "<td>Error Opening File</td>";
		}

		//if there was no input given, return the array of un-parsed lines
		if($customer_id === null) {
			//return array of un-parsed customers
			return $customers;

		//if there was an input given, find the customer id and extract the name	
		} else {
			$max = sizeof($customers);
			for ($i = 0; $i <= $max  - 2; $i++) {
				$custfield = explode(',', utf8_encode($customers[$i]));
				if($custfield[0] === $customer_id) {
					return $custfield[1] . " " . $custfield[2];
				}
			}
		}
	}


	function draw_customers( $customers ) {
		$max = sizeof($customers);
		for ($i = 0; $i <= $max - 2; $i++) {
		  // process the line read.
		  $custfield = explode(',', utf8_encode($customers[$i]));
		  echo "<tr>";
		  echo "<td><a href='book.php?customer_id=" . $custfield[0] . "'>" . $custfield[1] . " " . $custfield[2] . "</a></td>";
		  echo "<td>" . $custfield[3] . "</td>";
		  echo "<td>" . $custfield[4] . "</td>";
		  echo "<td>" . $custfield[6] . "</td>";
		  echo "</tr>";
		}
	}

?>