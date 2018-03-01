<?php
	function draw_orders( $customer_id = null ) {
		if($customer_id === null) {
			//do nothing

		} else {
			$orders = array();
			$index = 0;
			$handle = fopen("../data/orders.txt", "r");
			if ($handle) {
				//set $order[0] = "1,4,0133360903,Building Java Programs,Computer Science"
				//etc..[2]
				while (($orders[$index] = fgets($handle)) !== false) {
				  $index++;
				}
				fclose($handle);

			} else {
			echo "<td>Error Opening File</td>";
			}

			$desired_orders;
			$count = 0;
			//$max1 = sizeof($orders);
			for ($i = 0; $i <= 25; $i++) {
				//set $orderfield[0] = 1
				//set $orderfield[1] = 4 --> customer_id
				//set $orderfield[2] = 0133360903
				//set $orderfield[3] = Building Java Programs
				//set $orderfield[4] = Computer Science
				$orderfield = explode(',', utf8_encode($orders[$i]));
				if($orderfield[1] == $customer_id) {
					//set $desired_orders[] = $orderfield[]
					$desired_orders[$count] = $orderfield;
					$count++;
				}
			}

			if(empty($desired_orders)) {
			//say no data
				echo "<div class='well'>No orders for that customer</div>";
			} else {
			//echo table
				echo "<div class='panel panel-danger spaceabove'>";           
				echo "<div class='panel-heading'><h4>Orders for " . get_customers($customer_id) . "</h4></div>";
				echo "<table class='table'>";
				echo "<tr>";
				echo "<th> </th>";
				echo "<th>ISBN</th>";
				echo "<th>Title</th>";
				echo "<th>Category</th>";
				echo "</tr>";
				$max = sizeof($desired_orders);
				for($i = 0; $i <= $max - 1; $i++) {
					$desired_order = $desired_orders[$i];
					echo "<tr>";
					echo "<td><img src='../images/book/tinysquare/" . $desired_order[2] . ".jpg' alt='" . $desired_order[3] . "'></td>";
					echo "<td>" . $desired_order[2] . "</td>";
					echo "<td><a href='#'>" . $desired_order[3] . "</a></td>";
					echo "<td>" . $desired_order[4] . "</td>";
					echo "</tr>";
				}
				echo "</table>";
				echo "</div>";	
			}
		}	
	}
?>