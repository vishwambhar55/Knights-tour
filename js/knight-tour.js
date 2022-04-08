var CONST_STR_SQUARE_PREFIX = "squareID_";
	
	//counter of knight's moves
	var nGlobalCounter = 0;
	
	//horizontal chess board size
	var nBoardSizeHorizontal = 8;
	
	//vertical chess board size
	var nBoardSizeVertical = 8;
	
	//ASCII code for letter "a"
	var chALetterACIICode = 97;
	
	//coordinates for start knight's position
	var xStart, yStart;
	
	//coordinates for next knight's position
	var xNext, yNext;
	
	//x values and radius of circle give y value from formula y^2=R^2-x^2
	var arrayX = [-2, -1, 1, 2];
	var circleRadiusSquared = 5;
		
	//constructor	
    function NOAPMCalculator ()
    {
    }
    
    NOAPMCalculator.prototype.bIsMultipleSquaresWithMinimumNOAPM = false;
    
	//function to check whether square visited or not
	//check for out the board boundaries is performed as well.
	// true - not visited
	// false - visited
	NOAPMCalculator.prototype.IsSquareVisited = function (x, y)
	{
		//out of the board horizontal position
		if (!(x > 0 && x <= nBoardSizeHorizontal))
			return false;
		
		//out of the board vertical position
		if (!(y >= 0 && y < nBoardSizeVertical))
			return false;
		
		return IsSquareVisitedFromObject ($('#' + GetButtonIDString(x, y)));
	}
	
	//function to calculate board's square Number Of All Possible Moves (NOAPM) for Knight.
	NOAPMCalculator.prototype.SquareNOAPM = function (x, y)
	{
		var nSquareNOAPM = 0;
		
		var yOnCircle, xOnCircle, dY;
		
		for (var k = 0; k < arrayX.length; k++)
		{
			xOnCircle = x + arrayX[k];
			
            dY = Math.sqrt(circleRadiusSquared - Math.pow(arrayX[k], 2)); //+-
			
			for (var m = 1; m < 3; m++)
			{
				yOnCircle = y + Math.pow(-1, m) * dY;
				
				if (this.IsSquareVisited(xOnCircle, yOnCircle))
					nSquareNOAPM++;
				
			}
		}
			
		return nSquareNOAPM;
	}
		
    NOAPMCalculator.prototype.Calculate = function (x, y)
    {
        var nMinSquareNOAPM = 8;
        
        var nCurrentSquareNOAPM = 0;
        
        var nMoveCounter = 0;
                                
        var arrTheSameSquareNOAPMs = new Array (8);
        
        var objButton;
        
		var yOnCircle, xOnCircle, dY;
		
        for (var k = 0; k < arrayX.length; k++)
        {
			xOnCircle = x + arrayX[k];
			
            dY = Math.sqrt(circleRadiusSquared - Math.pow(arrayX[k], 2)); //+-
			
			for (var m = 1; m < 3; m++)
			{
				yOnCircle = y + Math.pow(-1, m) * dY;                
				
				//out of the board or visited
				if (!this.IsSquareVisited (xOnCircle, yOnCircle))
					continue;
				
				nMoveCounter++;
				
				arrTheSameSquareNOAPMs[nMoveCounter] = null;
				
				nCurrentSquareNOAPM = this.SquareNOAPM (xOnCircle, yOnCircle);
				
				console.log ("One of available moves [" + nMoveCounter.toString() + "] is " +  ButtonCoordinatesToChessCoordinates(xOnCircle, yOnCircle) + " . It has NOAPM: " + nCurrentSquareNOAPM.toString());
				
				if (nCurrentSquareNOAPM <= nMinSquareNOAPM)
				{
					nMinSquareNOAPM = nCurrentSquareNOAPM;
					
					arrTheSameSquareNOAPMs[nMoveCounter] = {
																xNew:xOnCircle,
																yNew:yOnCircle,
																NewSquareNOAPM:nCurrentSquareNOAPM,
															};
					
				}
                
			}	
        }
                
        //sanitize array
        var nNumberOfValidEntries = 0; 
        
        for (var s = 0; s < arrTheSameSquareNOAPMs.length; s++)
        {
            if (arrTheSameSquareNOAPMs[s] != null)
            {
                if (arrTheSameSquareNOAPMs[s].NewSquareNOAPM != nMinSquareNOAPM) //remove not minimum NOAPM entries in the array
                    arrTheSameSquareNOAPMs[s] = null;
                else
                    nNumberOfValidEntries++;                
            }
        }
        
        var arrTheSameSquareNOAPMsCopy = new Array(nNumberOfValidEntries);
        
        var i = 0;
        
        for (var s = 0; s < arrTheSameSquareNOAPMs.length; s++)
        {
            if (arrTheSameSquareNOAPMs[s] != null)
            {
                arrTheSameSquareNOAPMsCopy[i] = arrTheSameSquareNOAPMs[s];
                
                i++;        
            }
        }
        
        this.bIsMultipleSquaresWithMinimumNOAPM = (arrTheSameSquareNOAPMsCopy.length > 1);
        
        return arrTheSameSquareNOAPMsCopy;
    }
	    
    // Button id is in a format constant_y_x
	function GetButtonIDString (x, y)
	{
		return (CONST_STR_SQUARE_PREFIX + y.toString() + "_" + x.toString());
	}
	
	//create chessboard
    function createBoard ()
    {
        var tableMain = $('#tMain');
        
		var bColorFlag = true;
		
        var currentRow = null;
        
        var currentCell = null;
        
		var strInnerHTML;
		
        for (var i = 0; i <= nBoardSizeVertical; i++)
        {
			currentRow = $("<tr>");
            			
            for (var j = 0; j <= nBoardSizeHorizontal; j++)    
            {
                currentCell = $("<td>");
				
				//skip left bottom corner square
				if (i == nBoardSizeVertical && j == 0)
				{	
					currentRow.append(currentCell);
					
					continue;
				}
				
				//show letters in bottom row
				if (i == nBoardSizeVertical)
				{
					currentCell.text(String.fromCharCode(chALetterACIICode - 1 + j));
					
					currentRow.append(currentCell);
					
					continue;
				}
	
				//show numbers in left vertical row
				if (j == 0)
				{
					currentCell.text((nBoardSizeVertical - i).toString());
					
					currentRow.append(currentCell);
					
					continue;
				}
			
				//create HTML buttons as squares and apply appropriate style
				if (!bColorFlag)
				{
					currentCell.html("<button class='clsBtnDark' id='" + GetButtonIDString(j, i) + "' onclick='OnButtonClick(this);'></button>");  
				}
				else
				{
					currentCell.html("<button class='clsBtnLight' id='" + GetButtonIDString(j, i) + "' onclick='OnButtonClick(this);'></button>");  
				}
				
				bColorFlag = !bColorFlag;
				
				currentRow.append(currentCell);
             }
			 
			 bColorFlag = (i%2 != 0); 
			 
			 tableMain.append(currentRow);
        }
    } 
    
	//button/square on click event handler.
	function OnButtonClick (obj)
	{
		nGlobalCounter++;
		
		$(obj).text(nGlobalCounter.toString());
			
		var status = $("#txtaMoves");
		
		status.text(nGlobalCounter.toString() + ". " + ButtonIDToChessCoordinates(obj));
		
		DisableEnableAllSquares (true);	
	}
	
	//method to disable all buttons/squares after first click
	function DisableEnableAllSquares (bDisable)
	{
		for (i = 0; i < nBoardSizeVertical; i++)
		{
			for (j = 1; j <= nBoardSizeHorizontal; j++)
			{
				if (bDisable)
					$('#' + GetButtonIDString(j, i)).attr ('disabled', '');
				else	
					$('#' + GetButtonIDString(j, i)).removeAttr ('disabled');					
			}	
		}
	}
	
	//method to find initial knight's position on the board then set xStart and yStart
	function GetPlacementCoordinates ()
	{
		for (i = 0; i < nBoardSizeVertical; i++)
		{
			for (j = 1; j <= nBoardSizeHorizontal; j++)
			{
				if ($('#' + GetButtonIDString(j, i)).text () == '1')
				{
					xStart = j;
					yStart = i;
					return;
				}
			}	
		}
	}
	
	//function to convert button ID to chess notations.
	function ButtonIDToChessCoordinates (obj)
	{
		var strID = $(obj).attr("id");
		
		var array = strID.split("_");
				
		return (String.fromCharCode(chALetterACIICode - 1 + parseInt(array[2])) + "" + (nBoardSizeVertical - parseInt(array[1])).toString());
	}
	
	//function to convert button ID to chess notations.
	function ButtonCoordinatesToChessCoordinates (x, y)
	{
		return (ButtonIDToChessCoordinates ($('#' + GetButtonIDString(x, y))));
	}
	
	//on click event handler for "Clear The Chess Board" button 
	function clearBoard()
	{
		if(confirm("Are you sure to clear the board?")){
			init();
		}
	}

	//method to initialize all variables, statuses, buttons/squares
	function init() 
	{
		for (i = 0; i < nBoardSizeVertical; i++)
		{
			for (j = 1; j <= nBoardSizeHorizontal; j++)
			{
				$('#' + GetButtonIDString(j, i)).text ('');
			}	
		}
		
		DisableEnableAllSquares (false);
		
		var status = $("#txtaMoves");
		
		status.text('');
		
		nGlobalCounter = 0;
	}
	
	//function to check whether square visited or not
	// true - not visited
	// false - visited
	function IsSquareVisitedFromObject(obj)
	{
		var strSquareText = obj.text ();
		
		var bResult = (!(strSquareText != undefined && strSquareText != ''));
		
		return bResult;
	}
	
	//function to mark square as visited and check whether solution is found.
	function MarkSquareAsVisited (obj, nCurrentMoveSquareNOAPM)
	{
		if (nGlobalCounter == (nBoardSizeVertical * nBoardSizeHorizontal))
		{
			alert("Complete solution was found.");
			return true;
		}
		
		var bIncompleteFlag = false;
		
		if (nCurrentMoveSquareNOAPM != undefined && nCurrentMoveSquareNOAPM == 0 && nGlobalCounter == (nBoardSizeVertical * nBoardSizeHorizontal) - 1)
		{
			if (!IsSquareVisitedFromObject (obj))
				bIncompleteFlag = true;
		}
		else
		{
			if (nCurrentMoveSquareNOAPM != undefined && nCurrentMoveSquareNOAPM == 0 && nGlobalCounter > 1)
				bIncompleteFlag = true;
		}
			
		nGlobalCounter++;
		
		obj.text(nGlobalCounter.toString());
		
		UpdateMovesHistory (obj);
		
		if (bIncompleteFlag)
		{
			alert("Incomplete solution was found with " + nGlobalCounter.toString() + " squares covered.");
			return true;
		}
		
		return false;	
	}
	
	//method to update move history in text area
	function UpdateMovesHistory (obj)
	{
		var status = $("#txtaMoves");
		
		if (nGlobalCounter == 1)
			status.text(nGlobalCounter.toString() + ". " + ButtonIDToChessCoordinates(obj));
		else
			status.text(status.text() + " " + nGlobalCounter.toString() + ". " + ButtonIDToChessCoordinates(obj));
	}
		    
	function CheckMovesFromOneSquare (x, y)
	{
		console.log ("Current Knight position: " +  ButtonCoordinatesToChessCoordinates (x, y));
				
        var nMinSquareNOAPM = 8;
        
        var objNOAPMCalculator = new NOAPMCalculator();
        
		var arrTheSameSquareNOAPMs = objNOAPMCalculator.Calculate (x, y);
        
		if (arrTheSameSquareNOAPMs.length > 0 && arrTheSameSquareNOAPMs[0].NewSquareNOAPM == 0)
		{
			xNext = arrTheSameSquareNOAPMs[0].xNew;
			yNext = arrTheSameSquareNOAPMs[0].yNew;
		
			console.log ("Finished. It has NOAPM: 0");
		
			return nMinSquareNOAPM;
		}
		
		var nCurrentSquareNOAPMLevel2 = 0;
		
		var nMinSquareNOAPMLevel2 = 8;
		
		var nChoosenSquareNOAPMLevel2Index = 0;
		
		if (arrTheSameSquareNOAPMs.length > 1)
		{
			console.log ("Go for level 2 square is required.");
			 
            var arrTheSameSquareNOAPMs2;
            
			for (var p = 0; p < arrTheSameSquareNOAPMs.length; p++)
			{
				if (arrTheSameSquareNOAPMs[p] == null)
					continue;
										
				objButton = $('#' + GetButtonIDString(arrTheSameSquareNOAPMs[p].xNew, arrTheSameSquareNOAPMs[p].yNew));	
				
				objButton.text("v"); //temporary mask square
				
				arrTheSameSquareNOAPMs2 = objNOAPMCalculator.Calculate (arrTheSameSquareNOAPMs[p].xNew, arrTheSameSquareNOAPMs[p].yNew); 
				
                nCurrentSquareNOAPMLevel2 = arrTheSameSquareNOAPMs2[0].NewSquareNOAPM;
                
				if (nCurrentSquareNOAPMLevel2 < nMinSquareNOAPMLevel2)
				{
					nMinSquareNOAPMLevel2 = nCurrentSquareNOAPMLevel2;
					
					nChoosenSquareNOAPMLevel2Index = p;
				}
				
				objButton.text(""); //temporary unmask square
                
                arrTheSameSquareNOAPMs2 = null;
			}
		}
        else if (arrTheSameSquareNOAPMs.length == 1)
        {
            nMinSquareNOAPM = nChoosenSquareNOAPMLevel2Index = arrTheSameSquareNOAPMs[0].NewSquareNOAPM;
            
            xNext = arrTheSameSquareNOAPMs[0].xNew;
			yNext = arrTheSameSquareNOAPMs[0].yNew;
			
			console.log ("Next chosen move is " +  ButtonCoordinatesToChessCoordinates(xNext, yNext) + " . It has NOAPM: " + nMinSquareNOAPM);
            
            return nMinSquareNOAPM;
        }
        else
        {
            return 0; 
        }
        		
		xNext = arrTheSameSquareNOAPMs[nChoosenSquareNOAPMLevel2Index].xNew;
        yNext = arrTheSameSquareNOAPMs[nChoosenSquareNOAPMLevel2Index].yNew;
        
        console.log ("Next choosen move is " +  ButtonCoordinatesToChessCoordinates(xNext, yNext) + " . It has NOAPM: " + nMinSquareNOAPM);
				
		return nMinSquareNOAPM;
	}
	
	//recursive function to find solution to Knight's tour.
	function GetSolution(x, y){
						
		if (nGlobalCounter == 0)
		{
			alert ("Place Knight on the chess board first then click 'Find Solution' button again.");
			return;
		}
		
		if (nGlobalCounter == 1)	
		{
			GetPlacementCoordinates ();
			
			x = xStart;
			y = yStart;
		}	
		
		var nMinSquareNOAPM = CheckMovesFromOneSquare (x, y);
		
		//mark square as visited check whether solution is found. true - solution found. false - finding solution is in a progress.	
		var bResult = MarkSquareAsVisited ($('#' + GetButtonIDString(xNext, yNext)), nMinSquareNOAPM);
		
		if (bResult) 
			return; //stop recursive iteration
			
		//recursive call	
		GetSolution(xNext, yNext);		
		
		return; //continue recursive iteration
	}

	//calls to set up and initialize the chess board.
    createBoard ();
	
	init ();